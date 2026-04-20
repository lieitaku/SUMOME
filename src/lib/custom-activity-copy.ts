/**
 * act-01〜act-04 カスタムテンプレの本文（日文ソース）。
 * DB の translations に locale 別訳を保存し、getTranslated で表示する。
 * フィールドキーは route のハイフン無し + "_" + 短い id（例: act01_lead_p1）。
 */

import type { Prisma } from "@prisma/client";
import { getTranslated } from "@/lib/document-translations";

export const CUSTOM_ACTIVITY_ROUTES = ["act-01", "act-02", "act-03", "act-04"] as const;
export type CustomActivityRoute = (typeof CUSTOM_ACTIVITY_ROUTES)[number];

export function isCustomActivityRoute(route: string | null | undefined): route is CustomActivityRoute {
  return route != null && (CUSTOM_ACTIVITY_ROUTES as readonly string[]).includes(route);
}

/** route + 短い id → translations のトップレベルキー */
export function customActivityFieldKey(route: CustomActivityRoute, shortId: string): string {
  return `${route.replace(/-/g, "")}_${shortId}`;
}

/** 機翻ペイロード用: act01_xxx → 日文 */
export function getCustomTemplateJaPayload(route: CustomActivityRoute): Record<string, string> {
  const block = CUSTOM_ACTIVITY_JA[route];
  const out: Record<string, string> = {};
  for (const [shortId, ja] of Object.entries(block)) {
    if (ja?.trim()) out[customActivityFieldKey(route, shortId)] = ja.trim();
  }
  return out;
}

/** カスタムテンプレ本文の表示用（locale に応じて translations または日文ソース） */
export function txCustomActivity(
  translations: Prisma.JsonValue | null | undefined,
  locale: string,
  route: CustomActivityRoute,
  shortId: string
): string {
  const ja = CUSTOM_ACTIVITY_JA[route][shortId] ?? "";
  const field = customActivityFieldKey(route, shortId);
  return getTranslated(translations ?? null, field, locale, ja);
}

const CUSTOM_ACTIVITY_JA: Record<CustomActivityRoute, Record<string, string>> = {
  "act-01": {
    lead_p1_before:
      "この度、株式会社MEMORY（以下、弊社）は、12月20日(土)に開催されるサッカーイベント",
    lead_p1_event: "「TUNAGU MEMORY KIDS FOOTBALL in Sendai」",
    lead_p1_after: "に協賛いたします。",
    lead_p2:
      "本イベントは、仙台市内の子供たちにサッカーを通じた交流の場と、スポーツの楽しさを提供することを目的としています。",
    note_label: "ご注意",
    note_body:
      "なお、本大会の企画・運営は、相撲エンターテインメント部門SUMOMEではなく、弊社のスポーツイベント事業部である",
    note_spm: "SPME",
    note_after:
      "が担当しております。スポーツの力で地域と子供たちを繋ぐ、SPMEならではのイベントとなります。",
    lead_p3:
      "また、当日は会場にて、弊社の主力サービスであるフォトブック「MEMORY」の無料体験ブースを出展いたします。",
    svc_badge: "サービスについて",
    svc_title: "新感覚フォトブック「MEMORY」について",
    quote_line1:
      "当日ブースにて体験いただける「MEMORY」は、単に思い出を一冊にまとめるだけの「フォトブック」ではありません。",
    quote_line2: "その時代のニュースや出来事を共に掲載する、",
    quote_emphasis: "世界に一つの「情報誌」",
    quote_line3: "です。",
    feat_heading: "MEMORYの特徴",
    feat1_title: "「思い出」×「記事」×「ニュース」",
    feat1_body:
      "他の写真集と大きく異なるのは、「思い出の写真」に加え、「それに関する記事」と「その年のニュース」が一冊にまとまっている点です。ページをめくるたびに当時の空気感までが鮮やかに蘇り、まるでタイムカプセルを開くような体験をお届けします。",
    feat2_title: "人生の節目を可視化する「記録」",
    feat2_body:
      "旅行の記録、友人との大切な時間、出産や記念日など。表紙にはお気に入りの一枚を使用し、最終ページにはその年の主要ニュースを掲載します。これらを積み重ねていくことで、家族の歴史や人生の歩みを「記録」として美しく残すことができます。",
    feat3_title: "「おめでとう」を込めて、無料で",
    feat3_body:
      "MEMORYは、一般の方からの応募で製作される完全オリジナルのフリーペーパーです。協賛企業からの「おめでとうございます」という応援の想いを載せることで、お客様には無料でお届けしているのも大きな特徴です。",
    close1: "フォトブックであり、情報誌であり、",
    close2: "応援のメッセージでもある。",
    close3: "それが「MEMORY」です。",
    close4:
      "イベント当日は、この「MEMORY」の魅力を実際に体験いただけるブースをご用意して、",
    close5: "皆様のご来場を心よりお待ちしております。",
  },
  "act-02": {
    hdr_date_label: "日付",
    hdr_date_value: "2025.11.15 - 16",
    hdr_place_label: "場所",
    hdr_place_value: "Yokohama Red Brick",
    hdr_weather_label: "天気",
    hdr_weather_value: "晴れ",
    hero_l1: "「YOKOHAMA URBAN SPORTS FESTIVAL ’25」",
    hero_l2: "MEMORYブースへのご来場、",
    hero_l3: "誠にありがとうございました。",
    intro:
      "去る11月15日(土)、16日(日)の2日間にわたり開催されました「YOKOHAMA URBAN SPORTS FESTIVAL ’25」におきまして、弊社フォトブック「MEMORY」の無料体験ブースへ多数のご来場をいただき、誠にありがとうございました。",
    img_alt_left: "イベント会場（左）",
    img_alt_right: "イベント会場（右）",
    fb_kicker: "フィードバック",
    fb_title_l1: "予想を上回る反響と、",
    fb_title_l2: "笑顔の連鎖",
    fb_p1:
      "当日は、アーバンスポーツの活気あふれる雰囲気の中、予想を大きく上回る数のお客様に弊社ブースへお立ち寄りいただきました。",
    quote_title: "「思い出がその場で一冊の本になる感動」",
    quote_sub:
      "実際に体験されたお客様からは、\n多くの驚きと喜びの声を頂戴いたしました。",
    img_main_alt: "メインシーン",
    value_title: "「思い出」を「情報誌」として残す価値",
    value_p1:
      "今回のイベントを通じ、単なる写真集ではなく、その時代の空気感までをもパッケージする「情報誌としてのフォトブック」というMEMORYのコンセプトを、多くの方に体感いただけたことを大変嬉しく思います。",
    value_p2_before: "ご作成いただいた一冊が、ご家族やご友人との大切な時間を彩る",
    value_capsule: "「タイムカプセル」",
    value_p2_after: "として、末永く皆様のお手元に残ることを願っております。",
    smile_alt1: "笑顔の瞬間 1",
    smile_alt2: "笑顔の瞬間 2",
    smile_caption: "笑顔と記憶",
    outro_p1:
      "今回のイベントが大成功を収めることができましたのも、\nひとえにご来場いただいた皆様、そして関係者の皆様のご支援のおかげです。",
    outro_p2:
      "今後も弊社は、皆様の大切な思い出を「記録」として美しく、\nそして鮮やかに形に残せるよう、サービスの向上に努めてまいります。",
    sign_team: "Memoryチーム",
    sign_date: "2025.11.20",
  },
  "act-03": {
    pr_badge: "プレスリリース",
    pr_dates: "2025.11.15 - 16",
    pr_title_l1: "フォトブック「MEMORY」",
    pr_title_l2: "無料体験ブースを出展",
    pr_intro:
      "この度、株式会社MEMORY（以下、弊社）は、横浜赤レンガ倉庫にて開催されるアーバンスポーツの祭典「YOKOHAMA URBAN SPORTS FESTIVAL ’25」に出展いたします。\n当日は会場内に特設ブースを設け、弊社の新感覚フォトブック「MEMORY」をその場で作成・発行できる",
    pr_trial: "「無料体験会」",
    pr_intro_after: "を実施いたします。",
    concept_h3_l1: "フェスティバルの熱気を、",
    concept_h3_l2: "その場で「一冊」に。",
    concept_p1:
      "スケートボードやブレイキンなど、世界基準のアーバンスポーツが横浜に集結するこの2日間。会場で撮影したお気に入りの写真や、友人・家族との笑顔の瞬間を、その場で「MEMORY」にしてみませんか？",
    card_title: "「情報誌」スタイルのフォトブック",
    card_body:
      "「MEMORY」は、単に写真をまとめるだけではなく、その日のニュースや出来事も共に掲載されます。楽しかったイベントの記憶を、その時代の空気感とともに「タイムカプセル」のように閉じ込めてお持ち帰りいただけます。",
    ticket_invite: "ご招待",
    ticket_title: "どなたでも無料で体験可能",
    ticket_p1:
      "今回のブースでは、実際にスマートフォンなどの写真データを使って、ご自身だけのオリジナルフォトブック作成を無料で体験いただけます。",
    tag_phone: "スマホ対応",
    tag_family: "ご家族で歓迎",
    tag_free: "無料",
    price_hint: "ブースへお越しください",
    spec_event_label: "イベント名",
    spec_event_name: "YOKOHAMA URBAN SPORTS FESTIVAL ’25",
    spec_event_sub: "（横浜アーバンスポーツフェスティバル2025）",
    spec_date_label: "日付",
    spec_date_value: "2025年11月15日(土)・16日(日)",
    spec_venue_label: "会場",
    spec_venue_value: "横浜赤レンガ倉庫 イベント広場・赤レンガパーク",
    spec_content_label: "出展内容",
    spec_content_value: "フォトブック「MEMORY」の展示および無料作成体験",
    closing_p:
      "横浜赤レンガ倉庫にて、\n皆様の思い出づくりをお手伝いできることを楽しみにしております。\nぜひお気軽に弊社ブースへお立ち寄りください。",
    official_link: "公式サイト",
  },
  "act-04": {
    stamp_month: "9月",
    stamp_days: "27-28",
    kicker: "イベントレポート",
    title_l1: "MEMORYへのご来場、",
    title_l2: "誠にありがとうございました",
    intro:
      "去る9月27日(土)、28日(日)の2日間にわたり開催されました本イベントにおきまして、弊社フォトブック「MEMORY」の無料体験ブースへ多数のご来場をいただき、誠にありがとうございました。\nおかげさまで、両日ともに天候にも恵まれ、会場はアクションスポーツならではの熱気とご来場者様の笑顔に満ちた、素晴らしい空間となりました。",
    fb_title: "予想を遥かに超える反響",
    fb_p1:
      "当日は、BMXやパルクールなどのパフォーマンスに沸く会場の中で、予想を遥かに超える多くのお客様に弊社ブースへ足をお運びいただきました。",
    fb_p2:
      "スタッフの想定を上回る盛況ぶりに、嬉しい悲鳴をあげると同時に、皆様の「思い出を残したい」という熱い想いに触れ、スタッフ一同、深く感銘を受けました。",
    concept_title_l1: "「躍動する一瞬」を",
    concept_title_l2: "「情報誌」という形に",
    concept_p1:
      "アクションスポーツという、まさに「一瞬の輝き」が魅力のイベントにおいて、その瞬間をフォトブックという形あるものに残すことの意義を、多くの皆様と共有できたことを大変光栄に存じます。",
    concept_p2_before: "楽しかったイベントの記憶を、その日のニュースや空気感とともにパッケージした",
    concept_memory: "「MEMORY」",
    concept_p2_after: "が、皆様のご家庭で大切な「記録」として愛され続けることを願っております。",
    team_kicker: "チームからのメッセージ",
    team_p1:
      "皆様のあたたかい笑顔と熱気のおかげをもちまして、\n今回の出展は大成功のうちに幕を閉じることができました。\n今後も弊社は、皆様に新しい価値をお届けできるよう邁進してまいります。",
    team_p2: "引き続き、変わらぬご愛顧を",
    team_p3: "賜りますようお願い申し上げます。",
  },
};
