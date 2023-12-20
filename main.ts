import { parse } from "./src";
import { generate } from "./src/generater";
import { ThriftDocument } from "./src/types";
const ast = parse(`  
include "../base.thrift"

namespace go ad.va.provider
namespace py ad.va.provider

enum DateType {
    WEEK = 0;       // 自然周
    MONTH = 1;      // 自然月
    CUSTOM = 200;   // 自定义日期范围
}

struct TimeRange {
    1: DateType date_type;  // 时间段类型
    2: string start_date;   // yyyy-MM-dd
    3: string end_date;     // yyyy-MM-dd
}

struct CommonReq {
    1: optional i64 service_provider_id;    // 服务商id
    2: optional TimeRange time_range;       // 日期筛选
    3: optional list<i64> industry_id_list; // 行业id筛选，空表示全部行业
    4: optional list<i64> brand_id_list;    // 品牌id筛选，空表示全部品牌
    5: optional list<i64> member_uid_list;  // 成员uid筛选，空表示全部成员
    255: base.Base Base;
}

struct CommonResp {
    255: optional base.BaseResp BaseResp;
}

struct GetLatestUpdateTimeResp {
    1: required string end_date;            // 最新数据对应的业务日期，yyyy-MM-dd
    2: required string update_time;         // 最新数据的更新时间，yyyy-MM-dd HH:mm
    255: optional base.BaseResp BaseResp;
}

struct GetUserInfoResp {
    1: required string nick_name;           // 昵称
    2: required string avatar_url;          // 头像链接
    3: required string mask_email;          // 添加掩码后的邮箱
    255: optional base.BaseResp BaseResp;
}

struct GetProviderInfoResp {
    1: required string name;                                    // 服务商名称
    2: required i64 brand_cnt;                                  // 服务的品牌数
    3: required double brand_cnt_win;                           // 服务的品牌数超过了x%的服务商，取值[0, 1]
    4: required double duration_sum;                            // 近半年累计使用时长，单位小时
    5: required double duration_sum_win;                        // 近半年累计使用时长超过了x%的服务商，取值[0, 1]
    6: required double cost_sum;                                // 近半年策略采纳消耗金额，单位元
    7: required double cost_sum_win;                            // 近半年策略采纳消耗金额超过了x%的服务商，取值[0, 1]
    8: required i64 expiring_brand_cnt;                         // 授权即将到期的品牌数
    9: required list<string> junior_level_industries;           // 取得了初级认证的行业列表
    10: required list<string> medium_level_industries;          // 取得了中级认证的行业列表
    11: required list<string> golden_level_industries;          // 取得了金牌认证的行业列表
    255: optional base.BaseResp BaseResp;
}

struct GetServiceTargetResp {
    1: optional string start_date;              // 考核开始日期，可以为空，yyyy-MM-dd
    2: optional string end_date;                // 考核结束日期，可以为空，yyyy-MM-dd
    3: optional i64 provider_target;            // 企业目标值，可以为空，表示未设置企业目标
    4: optional double provider_achievement;    // 企业当前完成值，未设置企业目标时则为空
    5: optional i64 user_target;                // 个人目标值，可以为空，表示未设置个人目标
    6: optional double user_achievement;        // 个人当前完成值，未设置个人目标时则为空
    255: optional base.BaseResp BaseResp;
}

struct UpdateServiceTargetReq {
    1: required string start_date;          // 考核开始日期，yyyy-MM-dd
    2: required string end_date;            // 考核结束日期，yyyy-MM-dd
    3: required i64 service_provider_id;    // 服务商id
    4: optional i64 provider_target;        // 企业目标值，可以为空
    5: optional i64 user_target;            // 个人目标值，可以为空
    255: base.Base Base;
}

struct GetUserSettingsResp {
    1: required string nick_name;                   // 昵称
    2: required string mask_email;                  // 添加掩码后的邮箱
    3: required string mask_phone;                  // 添加掩码后的手机号
    4: required string provider_name;               // 服务商名称
    5: required string role_type;                   // 服务商角色
    6: optional string contact_name;                // 常用联系方式，姓名
    7: optional map<i64, string> contact_phone_map; // 常用联系方式，电话。key为id，value为添加掩码后的电话
    8: optional map<i64, string> contact_email_map; // 常用联系方式，邮箱。key为id，value为添加掩码后的电话
    9: optional string contact_address;             // 常用联系方式，地址
    255: optional base.BaseResp BaseResp;
}

struct UpdateContactSettingsReq {
    1: required i64 service_provider_id;        // 服务商id
    2: optional string contact_name;            // 常用联系方式，姓名
    3: optional string contact_address;         // 常用联系方式，地址
    4: optional list<i64> delete_phone_ids;     // 需要删除的电话id
    5: optional list<string> new_phone_list;    // 新添加的电话
    6: optional list<i64> delete_email_ids;     // 需要删除的邮箱id
    7: optional list<string> new_email_list;    // 新添加的邮箱
    255: base.Base Base;
}

struct GetServiceProviderListReq {
    1: optional string fuzzy_word;  // 模糊搜索词
    3: optional i64 limit;
    4: optional i64 offset;
    255: base.Base Base;
}

struct ProviderItem {
    1: required i64 service_provider_id;        // 服务商id
    2: required string service_provider_name;   // 服务商名称
    3: required i64 account_id;                 // 服务商管理员对应的 account_id
    4: optional string contact_name;            // 常用联系方式，姓名
    5: optional string contact_phone;           // 常用联系方式，电话
    6: optional string contact_address;         // 常用联系方式，地址
}

struct GetServiceProviderListResp {
    1: required list<ProviderItem> provider_list;   // 服务商列表
    2: required i64 total_cnt;                      // 服务商总数
    3: required i64 next_offset;                    // 下次分页请求的offset
    255: optional base.BaseResp BaseResp;
}

struct DateItem {
    1: required string date;
    2: optional double duration;
    3: optional double ad_cost;
    4: optional double star_cost;
    5: optional double search_cost;
}

struct IndustryItem {
    1: required i64 industry_id;
    2: required string industry_name;
    3: optional double duration;
}

struct UserItem {
    1: required i64 user_id;
    2: required string nickname;
    3: optional double duration;
}

struct GetServiceDataOverviewResp {
    1: required double duration_sum;                // 云图使用总时长
    2: required double duration_circle_raise;       // 使用时长环比
    3: required list<DateItem> daily_stats;         // 每日使用时长
    4: required list<IndustryItem> top_industries;  // top行业
    5: required list<UserItem> top_users;           // top成员
    255: optional base.BaseResp BaseResp;
}

struct GetServiceDataReq {
    1: required i64 service_provider_id;    // 服务商id
    2: required TimeRange time_range;       // 日期筛选
    3: optional list<i64> industry_id_list; // 行业id筛选，空表示全部行业
    4: optional list<i64> brand_id_list;    // 品牌id筛选，空表示全部品牌
    5: optional list<i64> member_uid_list;  // 成员uid筛选，空表示全部成员
    255: base.Base Base;
}

struct UserDetailItem {
    1: required i64 user_id;                        // 成员uid
    2: required string nickname;                    // 成员昵称
    3: optional string mask_email;                  // 成员账号（邮箱）
    4: optional double duration;                    // 使用时长，单位小时
    5: optional string mask_phone;                  // 成员账号（手机号）
}

struct BrandDetailItem {
    1: required i64 brand_id;                       // 品牌id
    2: required string brand_name;                  // 品牌名称
    3: optional i64 industry_id;                    // 行业id
    4: optional string industry_name;               // 行业名称
    5: optional double duration;                    // 使用时长，单位小时
    6: optional list<UserDetailItem> user_details;  // 成员明细
    7: optional i64 user_id;                        // 成员id
    8: optional string nickname;                    // 成员昵称
    9: optional string user_email;                  // 成员账号（邮箱）
    11: optional double user_duration;              // 成员使用时长，单位小时
    12: optional i64 auth_start_time;   // 授权生效日期
    13: optional i64 auth_end_time;     // 授权失效日期
    14: optional string level_1_module;             // 一级模块
    15: optional string level_2_module;             // 二级模块
    16: optional string level_3_module;             // 三级模块
    17: optional double user_duration_level_3_module;// 三级模块下使用时长
    18: optional string active_days;                 // 活跃天数
}

struct GetServiceDataDetailsResp {
    1: required list<BrandDetailItem> brand_details;
    255: optional base.BaseResp BaseResp;
}

enum AdoptedValueType {
    AD = 1;         // 广告消耗贡献
    STAR = 2;       // 星图订单贡献
    SEARCH = 3;     // 搜索词贡献
}

struct GetAdoptedValueReq {
    1: required i64 service_provider_id;            // 服务商id
    2: required TimeRange time_range;               // 日期筛选
    3: optional list<i64> industry_id_list;         // 行业id筛选，空表示全部行业
    4: optional list<i64> brand_id_list;            // 品牌id筛选，空表示全部品牌
    5: optional list<AdoptedValueType> type_list;   // 策略贡献类型筛选，空表示全部类型
    6: optional string search_key;                  // 类型id过滤（广告计划名称/id，广告主名称/id，达人名称/id），空表示不过滤
    7: optional i64 offset = 0;                     // 真实的offeset，不是page
    8: optional i64 limit = 10000;
    9: optional list<string> channel_list;              // 前端展示为平台
    10: optional list<i64> member_uid_list;                // 操作人id list
    255: base.Base Base;
}

struct GetAdoptedValueOverviewResp {
    1: required double ad_cost;                        // 广告消耗贡献
    2: required double star_cost;                      // 星图订单贡献
    3: required double search_cost;                    // 搜索词贡献
    4: required list<DateItem> daily_stats;         // 每日趋势
    255: optional base.BaseResp BaseResp;
}


struct GetDurationQuadrantChartResp {
    1: optional double single_user_time = 0.0;               // 单人使用时长
    2: optional double single_user_time_benchmark = 0.0;     // 单人使用时长基准
    3: optional double single_user_deep_engagement = 0.0;    // 单人深度使用
    4: optional i64 high_depth_high_duration = 0;            // 高深度，高时长
    5: optional i64 high_depth_low_duration = 0;             // 高深度，低时长
    6: optional i64 low_depth_high_duration = 0;             // 低深度，高时长
    7: optional i64 low_depth_low_duration = 0;              // 低深度，低时长
    255: optional base.BaseResp BaseResp;
}

struct GetAdoptedValueQuadrantChartResp {
    1: optional double adv_avg = 0.0;                      // adv_agv
    2: optional double adv_avg_benchmark = 0.0;            // benchmark_adv_avg
    3: optional double duration_avg = 0.0;                 // 时长avg
    4: optional i64 high_adopt_high_duration = 0;          // 高adv，高时长
    5: optional i64 high_adopt_low_duration = 0;           // 高adv，低时长
    6: optional i64 low_adopt_high_duration = 0;           // 低adv，高时长
    7: optional i64 low_adopt_low_duration = 0;            // 低adv，低时长
    255: optional base.BaseResp BaseResp;
}

struct AdoptedValueDetailItem {
    1: required string date;            // 日期
    2: required i64 brand_id;           // 品牌id
    3: required string brand_name;      // 品牌名称
    4: required i64 industry_id;        //
    5: required string industry_name;   // 行业
    6: required AdoptedValueType type;  // 广告形式
    7: required i64 user_id;            // 操作人id
    8: required string nick_name;       // 操作人
    9: required double cost;            // 消耗
    10: optional i64 package_id;        // 人群包id
    11: optional i64 ad_id;             // 广告计划id
    12: optional string ad_name;        //
    13: optional i64 adv_id;
    14: optional string adv_name;
    15: optional i64 star_uid;
    16: optional string star_nickname;
    17: optional string channel;        // 平台
    18: optional string action_event;   // 方式
    19: optional string platform;       // 渠道
    20: optional i64 auth_start_time;   // 授权生效日期
    21: optional i64 auth_end_time;     // 授权失效日期
    22: optional string package_name;   // 人群包名称
}

struct GetAdoptedValueDetailsResp {
    1: required list<AdoptedValueDetailItem> detail_list;
    2: required i64 total_cnt;
    255: optional base.BaseResp BaseResp;
}

struct AdoptedValueSummarieItem {
    1: required string date; // 日期
    2: required i64 brand_id; // 品牌id
    3: required string brand_name; // 品牌名称
    4: required i64 industry_id; // 行业id
    5: required string industry_name; // 行业名称
    6: required AdoptedValueType type; // 广告形式
    //7: required i64 user_id;
    //8: required string nick_name;
    9: required double cost; // 策略消耗
    //10: optional i64 package_id;
    //11: optional i64 ad_id;
    //12: optional string ad_name;
    //13: optional i64 adv_id;
    //14: optional string adv_name;
    //15: optional i64 star_uid;
    //16: optional string star_nickname;
    17: optional string channel; // 前端展示为平台
    18: optional string action_event; // 方式
    19: optional string platform; // 前端展示为渠道
}

struct GetAdoptedValueSummariesResp {
    1: required list<AdoptedValueSummarieItem> data; // 数据
    2: required i64 total_cnt; // 总数，用于分页
    3: required list<string> channel_list; // 平台列表
    255: optional base.BaseResp BaseResp;
}

struct GetCertificateOverviewResp {
    1: required i64 pass_adv_cnt;           // 通过高级人数
    2: required i64 pass_med_cnt;           // 通过中级人数
    3: required i64 pass_jnr_cnt;           // 通过初级人数
    255: optional base.BaseResp BaseResp;
}

struct GetCertificateReq {
    1: required i64 service_provider_id;        // 服务商id
    2: optional list<i64> valid_type_list;      // 过滤证书有效性，空表示全部状态。举例：[0]表示证书失效，[1]表示证书有效
    255: base.Base Base;
}

service ProviderService {
    // 云图管理员后台-服务商列表
    GetServiceProviderListResp GetServiceProviderList(1: GetServiceProviderListReq req);
    // 服务商相关授权信息（行业、品牌、成员）

    // 最新产出数据的业务日期和更新时间
    GetLatestUpdateTimeResp GetLatestUpdateTime(1: CommonReq req);
    // 首页-账号区域-信息展示
    GetUserInfoResp GetUserInfo(1: CommonReq req);
    // 首页-服务商信息概览
    GetProviderInfoResp GetProviderInfo(1: CommonReq req);
    // 首页-设置-查看基本信息
    GetUserSettingsResp GetUserSettings(1: CommonReq req);
    // 首页-设置-修改常用联系方式
    CommonResp UpdateContactSettings(1: UpdateContactSettingsReq req);
    // 服务数据分析-目标进度追踪
    GetServiceTargetResp GetServiceTarget(1: CommonReq req);
    // 服务数据分析-目标设定
    CommonResp UpdateServiceTarget(1: UpdateServiceTargetReq req);
    // 服务数据分析-数据概览（总时长、排行榜）
    GetServiceDataOverviewResp GetServiceDataOverview(1: GetServiceDataReq req);
    // 服务数据分析-明细列表
    GetServiceDataDetailsResp GetServiceDataDetails(1: GetServiceDataReq req);
    // 服务数据分析-右侧列表（新增的）
    GetServiceDataDetailsResp GetServiceSummaries(1: GetServiceDataReq req);
    // 策略贡献分析-数据概览（采纳数、分天趋势）
    GetAdoptedValueOverviewResp GetAdoptedValueOverview(1: GetAdoptedValueReq req);
    // 策略贡献分析-明细列表
    GetAdoptedValueDetailsResp GetAdoptedValueDetails(1: GetAdoptedValueReq req);
    // 策略贡献分析-统计数据
    GetAdoptedValueSummariesResp GetAdoptedValueSummaries(1: GetAdoptedValueReq req);
    // 人才认证概览-数据概览
    GetCertificateOverviewResp GetCertificateOverview(1: GetCertificateReq req);
    // 服务数据分析-时长四象限图
    GetDurationQuadrantChartResp GetDurationQuadrantChart(1: GetServiceDataReq req);
    // 策略贡献分析-合作品牌表现四象限图
    GetAdoptedValueQuadrantChartResp GetAdoptedValueQuadrantChart(1: GetAdoptedValueReq req);
}
  `);

if (ast.type === "ThriftDocument") {
  const obj = generate(ast as ThriftDocument, ["GetAdoptedValueSummaries"]);
  console.log(obj.get("GetAdoptedValueSummaries"));
}
