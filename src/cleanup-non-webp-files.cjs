const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 按当前项目实际使用的 Bucket 名称配置
const BUCKETS = ["images", "magazines"];

// 认为是“旧图片格式”的扩展名（不包括 webp）
const OLD_IMAGE_EXT = /\.(png|jpe?g|gif|bmp|tiff?)$/i;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("请先在环境变量中设置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY。");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function listAllFiles(bucket, prefix = "") {
  const pageSize = 100;
  let offset = 0;
  const results = [];

  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: pageSize, offset });

    if (error) {
      throw new Error(
        `List error in bucket=${bucket}, prefix=${prefix}: ${error.message}`
      );
    }

    if (!data || data.length === 0) break;

    for (const item of data) {
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      const isFolder =
        !item.metadata || Object.keys(item.metadata).length === 0;

      if (isFolder) {
        const sub = await listAllFiles(bucket, path);
        results.push(...sub);
      } else {
        results.push(path);
      }
    }

    if (data.length < pageSize) break;
    offset += pageSize;
  }

  return results;
}

async function cleanupBucket(bucket) {
  console.log(`\n==> 扫描 Bucket: ${bucket}`);
  const allFiles = await listAllFiles(bucket);
  console.log(`发现文件总数: ${allFiles.length}`);

  const toDelete = allFiles.filter(
    (path) => OLD_IMAGE_EXT.test(path) && !path.toLowerCase().endsWith(".webp")
  );

  console.log(`准备删除的旧格式图片数量: ${toDelete.length}`);
  if (toDelete.length === 0) return;

  const batchSize = 100;
  for (let i = 0; i < toDelete.length; i += batchSize) {
    const batch = toDelete.slice(i, i + batchSize);
    console.log(`删除第 ${i + 1} ~ ${i + batch.length} 个文件...`);
    const { error } = await supabase.storage.from(bucket).remove(batch);
    if (error) {
      console.error("删除失败:", error);
      throw error;
    }
  }

  console.log(`Bucket ${bucket} 清理完成 ✅`);
}

async function main() {
  try {
    for (const bucket of BUCKETS) {
      await cleanupBucket(bucket);
    }
    console.log("\n所有 Bucket 清理完成 ✅");
  } catch (err) {
    console.error("清理过程中出错:", err);
    process.exit(1);
  }
}

main();