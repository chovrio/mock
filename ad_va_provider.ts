// @ts-nocheck
/* eslint-disable */
/* tslint:disable */

import * as base from '../base';

export { base };

export enum DateType {
  /** 自然周 */
  WEEK = 0,
  /** 自然月 */
  MONTH = 1,
  /** 自定义日期范围 */
  CUSTOM = 200,
}

export enum AdoptedValueType {
  /** 广告消耗贡献 */
  AD = 1,
  /** 星图订单贡献 */
  STAR = 2,
  /** 搜索词贡献 */
  SEARCH = 3,
}


export interface TimeRange {
  /** 时间段类型 */
  date_type: DateType;
  /** yyyy-MM-dd */
  start_date: string;
  /** yyyy-MM-dd */
  end_date: string;
}

export interface CommonReq {
  /** 服务商id */
  service_provider_id?: string;
  /** 日期筛选 */
  time_range?: TimeRange;
  /** 行业id筛选，空表示全部行业 */
  industry_id_list?: Array<string>;
  /** 品牌id筛选，空表示全部品牌 */
  brand_id_list?: Array<string>;
  /** 成员uid筛选，空表示全部成员 */
  member_uid_list?: Array<string>;
  Base?: base.Base;
}

export interface CommonResp {
  BaseResp?: base.BaseResp;
}

export interface GetLatestUpdateTimeResp {
  /** 最新数据对应的业务日期，yyyy-MM-dd */
  end_date: string;
  /** 最新数据的更新时间，yyyy-MM-dd HH:mm */
  update_time: string;
  BaseResp?: base.BaseResp;
}

export interface GetUserInfoResp {
  /** 昵称 */
  nick_name: string;
  /** 头像链接 */
  avatar_url: string;
  /** 添加掩码后的邮箱 */
  mask_email: string;
  BaseResp?: base.BaseResp;
}

export interface GetProviderInfoResp {
  /** 服务商名称 */
  name: string;
  /** 服务的品牌数 */
  brand_cnt: string;
  /** 服务的品牌数超过了x%的服务商，取值[0, 1] */
  brand_cnt_win: number;
  /** 近半年累计使用时长，单位小时 */
  duration_sum: number;
  /** 近半年累计使用时长超过了x%的服务商，取值[0, 1] */
  duration_sum_win: number;
  /** 近半年策略采纳消耗金额，单位元 */
  cost_sum: number;
  /** 近半年策略采纳消耗金额超过了x%的服务商，取值[0, 1] */
  cost_sum_win: number;
  /** 授权即将到期的品牌数 */
  expiring_brand_cnt: string;
  /** 取得了初级认证的行业列表 */
  junior_level_industries: Array<string>;
  /** 取得了中级认证的行业列表 */
  medium_level_industries: Array<string>;
  /** 取得了金牌认证的行业列表 */
  golden_level_industries: Array<string>;
  BaseResp?: base.BaseResp;
}

export interface GetServiceTargetResp {
  /** 考核开始日期，可以为空，yyyy-MM-dd */
  start_date?: string;
  /** 考核结束日期，可以为空，yyyy-MM-dd */
  end_date?: string;
  /** 企业目标值，可以为空，表示未设置企业目标 */
  provider_target?: string;
  /** 企业当前完成值，未设置企业目标时则为空 */
  provider_achievement?: number;
  /** 个人目标值，可以为空，表示未设置个人目标 */
  user_target?: string;
  /** 个人当前完成值，未设置个人目标时则为空 */
  user_achievement?: number;
  BaseResp?: base.BaseResp;
}

export interface UpdateServiceTargetReq {
  /** 考核开始日期，yyyy-MM-dd */
  start_date: string;
  /** 考核结束日期，yyyy-MM-dd */
  end_date: string;
  /** 服务商id */
  service_provider_id: string;
  /** 企业目标值，可以为空 */
  provider_target?: string;
  /** 个人目标值，可以为空 */
  user_target?: string;
  Base?: base.Base;
}

export interface GetUserSettingsResp {
  /** 昵称 */
  nick_name: string;
  /** 添加掩码后的邮箱 */
  mask_email: string;
  /** 添加掩码后的手机号 */
  mask_phone: string;
  /** 服务商名称 */
  provider_name: string;
  /** 服务商角色 */
  role_type: string;
  /** 常用联系方式，姓名 */
  contact_name?: string;
  /** 常用联系方式，电话。key为id，value为添加掩码后的电话 */
  contact_phone_map?: { [key: string]: string };
  /** 常用联系方式，邮箱。key为id，value为添加掩码后的电话 */
  contact_email_map?: { [key: string]: string };
  /** 常用联系方式，地址 */
  contact_address?: string;
  BaseResp?: base.BaseResp;
}

export interface UpdateContactSettingsReq {
  /** 服务商id */
  service_provider_id: string;
  /** 常用联系方式，姓名 */
  contact_name?: string;
  /** 常用联系方式，地址 */
  contact_address?: string;
  /** 需要删除的电话id */
  delete_phone_ids?: Array<string>;
  /** 新添加的电话 */
  new_phone_list?: Array<string>;
  /** 需要删除的邮箱id */
  delete_email_ids?: Array<string>;
  /** 新添加的邮箱 */
  new_email_list?: Array<string>;
  Base?: base.Base;
}

export interface GetServiceProviderListReq {
  /** 模糊搜索词 */
  fuzzy_word?: string;
  limit?: string;
  offset?: string;
  Base?: base.Base;
}

export interface ProviderItem {
  /** 服务商id */
  service_provider_id: string;
  /** 服务商名称 */
  service_provider_name: string;
  /** 服务商管理员对应的 account_id */
  account_id: string;
  /** 常用联系方式，姓名 */
  contact_name?: string;
  /** 常用联系方式，电话 */
  contact_phone?: string;
  /** 常用联系方式，地址 */
  contact_address?: string;
}

export interface GetServiceProviderListResp {
  /** 服务商列表 */
  provider_list: Array<ProviderItem>;
  /** 服务商总数 */
  total_cnt: string;
  /** 下次分页请求的offset */
  next_offset: string;
  BaseResp?: base.BaseResp;
}

export interface DateItem {
  date: string;
  duration?: number;
  ad_cost?: number;
  star_cost?: number;
  search_cost?: number;
}

export interface IndustryItem {
  industry_id: string;
  industry_name: string;
  duration?: number;
}

export interface UserItem {
  user_id: string;
  nickname: string;
  duration?: number;
}

export interface GetServiceDataOverviewResp {
  /** 云图使用总时长 */
  duration_sum: number;
  /** 使用时长环比 */
  duration_circle_raise: number;
  /** 每日使用时长 */
  daily_stats: Array<DateItem>;
  /** top行业 */
  top_industries: Array<IndustryItem>;
  /** top成员 */
  top_users: Array<UserItem>;
  BaseResp?: base.BaseResp;
}

export interface GetServiceDataReq {
  /** 服务商id */
  service_provider_id: string;
  /** 日期筛选 */
  time_range: TimeRange;
  /** 行业id筛选，空表示全部行业 */
  industry_id_list?: Array<string>;
  /** 品牌id筛选，空表示全部品牌 */
  brand_id_list?: Array<string>;
  /** 成员uid筛选，空表示全部成员 */
  member_uid_list?: Array<string>;
  Base?: base.Base;
}

export interface UserDetailItem {
  /** 成员uid */
  user_id: string;
  /** 成员昵称 */
  nickname: string;
  /** 成员账号（邮箱） */
  mask_email?: string;
  /** 使用时长，单位小时 */
  duration?: number;
  /** 成员账号（手机号） */
  mask_phone?: string;
}

export interface BrandDetailItem {
  /** 品牌id */
  brand_id: string;
  /** 品牌名称 */
  brand_name: string;
  /** 行业id */
  industry_id?: string;
  /** 行业名称 */
  industry_name?: string;
  /** 使用时长，单位小时 */
  duration?: number;
  /** 成员明细 */
  user_details?: Array<UserDetailItem>;
  /** 成员id */
  user_id?: string;
  /** 成员昵称 */
  nickname?: string;
  /** 成员账号（邮箱） */
  user_email?: string;
  /** 成员使用时长，单位小时 */
  user_duration?: number;
  /** 授权生效日期 */
  auth_start_time?: string;
  /** 授权失效日期 */
  auth_end_time?: string;
  /** 一级模块 */
  level_1_module?: string;
  /** 二级模块 */
  level_2_module?: string;
  /** 三级模块 */
  level_3_module?: string;
  /** 三级模块下使用时长 */
  user_duration_level_3_module?: number;
  /** 活跃天数 */
  active_days?: string;
}

export interface GetServiceDataDetailsResp {
  brand_details: Array<BrandDetailItem>;
  BaseResp?: base.BaseResp;
}

export interface GetAdoptedValueReq {
  /** 服务商id */
  service_provider_id: string;
  /** 日期筛选 */
  time_range: TimeRange;
  /** 行业id筛选，空表示全部行业 */
  industry_id_list?: Array<string>;
  /** 品牌id筛选，空表示全部品牌 */
  brand_id_list?: Array<string>;
  /** 策略贡献类型筛选，空表示全部类型 */
  type_list?: Array<AdoptedValueType>;
  /** 类型id过滤（广告计划名称/id，广告主名称/id，达人名称/id），空表示不过滤 */
  search_key?: string;
  /** 真实的offeset，不是page */
  offset?: string;
  limit?: string;
  /** 前端展示为平台 */
  channel_list?: Array<string>;
  /** 操作人id list */
  member_uid_list?: Array<string>;
  Base?: base.Base;
}

export interface GetAdoptedValueOverviewResp {
  /** 广告消耗贡献 */
  ad_cost: number;
  /** 星图订单贡献 */
  star_cost: number;
  /** 搜索词贡献 */
  search_cost: number;
  /** 每日趋势 */
  daily_stats: Array<DateItem>;
  BaseResp?: base.BaseResp;
}

export interface GetDurationQuadrantChartResp {
  /** 单人使用时长 */
  single_user_time?: number;
  /** 单人使用时长基准 */
  single_user_time_benchmark?: number;
  /** 单人深度使用 */
  single_user_deep_engagement?: number;
  /** 高深度，高时长 */
  high_depth_high_duration?: string;
  /** 高深度，低时长 */
  high_depth_low_duration?: string;
  /** 低深度，高时长 */
  low_depth_high_duration?: string;
  /** 低深度，低时长 */
  low_depth_low_duration?: string;
  BaseResp?: base.BaseResp;
}

export interface GetAdoptedValueQuadrantChartResp {
  /** adv_agv */
  adv_avg?: number;
  /** benchmark_adv_avg */
  adv_avg_benchmark?: number;
  /** 时长avg */
  duration_avg?: number;
  /** 高adv，高时长 */
  high_adopt_high_duration?: string;
  /** 高adv，低时长 */
  high_adopt_low_duration?: string;
  /** 低adv，高时长 */
  low_adopt_high_duration?: string;
  /** 低adv，低时长 */
  low_adopt_low_duration?: string;
  BaseResp?: base.BaseResp;
}

export interface AdoptedValueDetailItem {
  /** 日期 */
  date: string;
  /** 品牌id */
  brand_id: string;
  /** 品牌名称 */
  brand_name: string;
  /** 行业 */
  industry_id: string;
  industry_name: string;
  /** 广告形式 */
  type: AdoptedValueType;
  /** 操作人id */
  user_id: string;
  /** 操作人 */
  nick_name: string;
  /** 消耗 */
  cost: number;
  /** 人群包id */
  package_id?: string;
  /** 广告计划id */
  ad_id?: string;
  ad_name?: string;
  adv_id?: string;
  adv_name?: string;
  star_uid?: string;
  star_nickname?: string;
  /** 平台 */
  channel?: string;
  /** 方式 */
  action_event?: string;
  /** 渠道 */
  platform?: string;
  /** 授权生效日期 */
  auth_start_time?: string;
  /** 授权失效日期 */
  auth_end_time?: string;
  /** 人群包名称 */
  package_name?: string;
}

export interface GetAdoptedValueDetailsResp {
  detail_list: Array<AdoptedValueDetailItem>;
  total_cnt: string;
  BaseResp?: base.BaseResp;
}

export interface AdoptedValueSummarieItem {
  /** 日期 */
  date: string;
  /** 品牌id */
  brand_id: string;
  /** 品牌名称 */
  brand_name: string;
  /** 行业id */
  industry_id: string;
  /** 行业名称 */
  industry_name: string;
  /** 广告形式 */
  type: AdoptedValueType;
  /** 7: required i64 user_id; */
  /** 8: required string nick_name; */
  /** 策略消耗 */
  cost: number;
  /** 10: optional i64 package_id; */
  /** 11: optional i64 ad_id; */
  /** 12: optional string ad_name; */
  /** 13: optional i64 adv_id; */
  /** 14: optional string adv_name; */
  /** 15: optional i64 star_uid; */
  /** 16: optional string star_nickname; */
  /** 前端展示为平台 */
  channel?: string;
  /** 方式 */
  action_event?: string;
  /** 前端展示为渠道 */
  platform?: string;
}

export interface GetAdoptedValueSummariesResp {
  /** 数据 */
  data: Array<AdoptedValueSummarieItem>;
  /** 总数，用于分页 */
  total_cnt: string;
  /** 平台列表 */
  channel_list: Array<string>;
  BaseResp?: base.BaseResp;
}

export interface GetCertificateOverviewResp {
  /** 通过高级人数 */
  pass_adv_cnt: string;
  /** 通过中级人数 */
  pass_med_cnt: string;
  /** 通过初级人数 */
  pass_jnr_cnt: string;
  BaseResp?: base.BaseResp;
}

export interface GetCertificateReq {
  /** 服务商id */
  service_provider_id: string;
  /** 过滤证书有效性，空表示全部状态。举例：[0]表示证书失效，[1]表示证书有效 */
  valid_type_list?: Array<string>;
  Base?: base.Base;
}


export declare class ProviderService {
  /** 云图管理员后台-服务商列表 */
  public GetServiceProviderList(req: GetServiceProviderListReq): Promise<GetServiceProviderListResp>;

  /** 服务商相关授权信息（行业、品牌、成员） */
  /** 最新产出数据的业务日期和更新时间 */
  public GetLatestUpdateTime(req: CommonReq): Promise<GetLatestUpdateTimeResp>;

  /** 首页-账号区域-信息展示 */
  public GetUserInfo(req: CommonReq): Promise<GetUserInfoResp>;

  /** 首页-服务商信息概览 */
  public GetProviderInfo(req: CommonReq): Promise<GetProviderInfoResp>;

  /** 首页-设置-查看基本信息 */
  public GetUserSettings(req: CommonReq): Promise<GetUserSettingsResp>;

  /** 首页-设置-修改常用联系方式 */
  public UpdateContactSettings(req: UpdateContactSettingsReq): Promise<CommonResp>;

  /** 服务数据分析-目标进度追踪 */
  public GetServiceTarget(req: CommonReq): Promise<GetServiceTargetResp>;

  /** 服务数据分析-目标设定 */
  public UpdateServiceTarget(req: UpdateServiceTargetReq): Promise<CommonResp>;

  /** 服务数据分析-数据概览（总时长、排行榜） */
  public GetServiceDataOverview(req: GetServiceDataReq): Promise<GetServiceDataOverviewResp>;

  /** 服务数据分析-明细列表 */
  public GetServiceDataDetails(req: GetServiceDataReq): Promise<GetServiceDataDetailsResp>;

  /** 服务数据分析-右侧列表（新增的） */
  public GetServiceSummaries(req: GetServiceDataReq): Promise<GetServiceDataDetailsResp>;

  /** 策略贡献分析-数据概览（采纳数、分天趋势） */
  public GetAdoptedValueOverview(req: GetAdoptedValueReq): Promise<GetAdoptedValueOverviewResp>;

  /** 策略贡献分析-明细列表 */
  public GetAdoptedValueDetails(req: GetAdoptedValueReq): Promise<GetAdoptedValueDetailsResp>;

  /** 策略贡献分析-统计数据 */
  public GetAdoptedValueSummaries(req: GetAdoptedValueReq): Promise<GetAdoptedValueSummariesResp>;

  /** 人才认证概览-数据概览 */
  public GetCertificateOverview(req: GetCertificateReq): Promise<GetCertificateOverviewResp>;

  /** 服务数据分析-时长四象限图 */
  public GetDurationQuadrantChart(req: GetServiceDataReq): Promise<GetDurationQuadrantChartResp>;

  /** 策略贡献分析-合作品牌表现四象限图 */
  public GetAdoptedValueQuadrantChart(req: GetAdoptedValueReq): Promise<GetAdoptedValueQuadrantChartResp>;

}
