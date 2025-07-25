using AutoMapper;
using Backend.Domain.DTO;
using Backend.Domain.Models;

namespace Backend.Domain.Mappers;

public class EventPeriodProfile : Profile
{
    public EventPeriodProfile()
    {
        CreateMap<Event, EventDTO>().ReverseMap();
        CreateMap<Event, UpdateEventDTO>().ReverseMap();
        CreateMap<Event, CreateEventDTO>().ReverseMap();
        CreateMap<Event, EventTimelineDTO>().ReverseMap();

        CreateMap<Period, PeriodDTO>().ReverseMap();
        CreateMap<Period, UpdatePeriodDTO>().ReverseMap();
        CreateMap<Period, CreatePeriodDTO>().ReverseMap();
        CreateMap<Period, PeriodTimelineDTO>().ReverseMap();

        // Examples from existing project that demonstrates what can be done here
        //=======================================================================

        // CreateMap<InvestmentsOverview, DtoModel.InvestmentsOverviewDto>()
        //    .ReverseMap();

        // CreateMap<DomainModel.InvestmentOpportunity, DtoModel.InvestmentOpportunitySummaryDto>()
        //     .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Name))
        //     .ForMember(dest => dest.ProgressDescription, opt => opt.MapFrom(src => src.Progress.Description))
        //     .IncludeBase<TranslatableBaseEntity, BaseModelDto>()
        //     .ReverseMap();

        // CreateMap<DomainModel.InvestmentOpportunity, DtoModel.DashboardInvestmentDto>()
        //     .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Name))
        //     .ForMember(dest => dest.InitiativeName, opt => opt.MapFrom(src => src.Compact != null ? src.Compact.Name : null))
        //     .ForMember(dest => dest.InitiativeSlug, opt => opt.MapFrom(src => src.Compact != null ? src.Compact.Slug : null))
        //     .ForMember(dest => dest.SavedOn, opt => opt.MapFrom((src, _, _, context) =>
        //     {
        //         var param = context.Items.ContainsKey("OrganizationId") ? context.Items["OrganizationId"].ToString() : null;
        //         var organizationId = param is null ? Guid.Empty : Guid.Parse(param);

        //         return src.SavedByUsers.FirstOrDefault(si => si.OrganizationId == organizationId)?.CreatedOnDateTimeUtc ?? DateTime.Now;

        //     }))
        //     .ReverseMap();

        // CreateMap<DomainModel.InvestmentOpportunity, DtoModel.InvestmentOpportunityDto>()
        //     .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Name))
        //     .ForMember(dest => dest.SupportedContributorTypes, opt => opt.MapFrom(src => src.Contributors))
        //     .ForMember(dest => dest.CommitedContributors, opt => opt.MapFrom(src => src.Organizations))
        //     .ForMember(dest => dest.GoalIds, opt => opt.MapFrom(src => src.Milestones.Select(m => m.MilestoneId)))
        //     .IncludeBase<TranslatableBaseEntity, BaseModelDto>()
        //     .ReverseMap();

        // CreateMap<DomainModel.InvestmentOpportunity, DtoModel.LinkedInvestmentDto>()
        //     .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Name))
        //     .ForMember(dest => dest.InvestmentSlug, opt => opt.MapFrom(src => src.Slug))
        //     .ReverseMap();

        // CreateMap<DomainModel.InvestmentProgress, DtoModel.InvestmentProgressDto>()
        //     .IncludeBase<TranslatableBaseEntity, BaseModelDto>()
        //     .ReverseMap();

        // CreateMap<DomainModel.InvestmentContributor, DtoModel.ContributorDto>()
        //     .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Contributor.Id))
        //     .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Contributor.Name))
        //     .ReverseMap();

        // CreateMap<DomainModel.InvestmentOrganization, InvestmentOrganizationExtendedDto>()
        //     .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Organization != null ? src.Organization.Name : src.Name))
        //     .ForMember(dest => dest.Logo, opt => opt.ConvertUsing(new CdnUrlResolver(), src => src.Organization != null ? src.Organization.Logo : ""))
        //     .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.Organization != null ? src.Organization.Url : src.URL))
        //     .ReverseMap();

        // CreateMap<DomainModel.InvestmentCommodity, CommoditySummaryDto>()
        //  .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Commodity.Id))
        //  .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Commodity.Name))
        //  .ReverseMap();

        // CreateMap<DomainModel.InvestmentCommodity, DtoModel.InvestmentCommodityDto>()
        //    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Commodity.Id))
        //    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Commodity.Name))
        //    .ForMember(dest => dest.Image, opt => opt.ConvertUsing(new CdnUrlResolver(), src => src.Commodity.Image))
        //    .ReverseMap();

        // CreateMap<InvestmentWriteModel, DtoModel.Write.InvestmentInsertDto>()
        //     .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Name))
        //     .ForMember(dest => dest.GoalIds, opt => opt.MapFrom(src => src.MilestoneIds))
        //     .ReverseMap();

        // CreateMap<InvestmentWriteModel, DtoModel.Write.InvestmentUpdateDto>()
        //     .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Name))
        //     .ForMember(dest => dest.GoalIds, opt => opt.MapFrom(src => src.MilestoneIds))
        //     .ReverseMap();

        // CreateMap<PotentialClaims, DtoModel.PotentialClaimsDto>()
        //    .ReverseMap();

        // CreateMap<FundraisingStrategy, DtoModel.FundraisingStrategyDto>()
        //    .ReverseMap();

        // CreateMap<InvestmentSummary, SummaryDto>()
        //     .ForMember(dest => dest.Text, opt => opt.MapFrom(src => src.Summary))
        //     .ReverseMap();

        // CreateMap<DomainModel.InvestmentContributor, ContributorSimpleDto>()
        //    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ContributorId))
        //    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Contributor.Name))
        //    .ReverseMap();

        // CreateMap<DomainModel.Contributor, ContributorSimpleDto>()
        //    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
        //    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
        //    .ReverseMap();

        // CreateMap<InvestmentOrganization, InvestmentOrganizationDto>()
        //    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.OrganizationId != null ? src.OrganizationId : src.Id))
        //    .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.URL))
        //    .ReverseMap();

        // CreateMap<InvestmentOrganizationGroups, InvestmentOrganizationGroupsDto>()
        //     .ForMember(dest => dest.Custom, opt => opt.MapFrom(src => src.CustomInvestmentOrganizations))
        //     .ForMember(dest => dest.Organizations, opt => opt.MapFrom(src => src.NonCustomInvestmentOrganizations))
        //    .ReverseMap();

        // CreateMap<InvestmentTheme, InvestmentThemeDto>()
        //     .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
        //     .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
        //     .ForMember(dest => dest.Icon, opt => opt.ConvertUsing(new CdnUrlResolver(), src => src.Icon))
        //     .ForMember(dest => dest.SortOrder, opt => opt.MapFrom(src => src.SortOrder))
        //     .IncludeBase<TranslatableBaseEntity, ExistingBaseModelDto>()
        //     .ReverseMap();

        // CreateMap<InvestmentTheme, InvestmentThemeBasicDto>()
        //    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
        //    .ForMember(dest => dest.ThemeId, opt => opt.MapFrom(src => src.Id))
        //    .ReverseMap();
    }
}
