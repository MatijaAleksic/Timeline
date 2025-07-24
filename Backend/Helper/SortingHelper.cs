using System.Linq.Expressions;

namespace Backend.Helper;

public static class SortingHelper
{
    public static IQueryable<T> ApplySorting<T>(
        IQueryable<T> query,
        string? sortColumn,
        string? sortDirection,
        HashSet<string>? allowedSortColumns = null
    )
    {
        if (string.IsNullOrEmpty(sortColumn))
            return query;

        if (allowedSortColumns != null && !allowedSortColumns.Contains(sortColumn))
            return query;

        bool ascending = string.IsNullOrEmpty(sortDirection) || sortDirection.ToLower() == "asc";

        var param = Expression.Parameter(typeof(T), "e");
        var property = Expression.PropertyOrField(param, sortColumn);

        var sortLambda = Expression.Lambda(property, param);

        string methodName = ascending ? "OrderBy" : "OrderByDescending";

        var resultExp = Expression.Call(
            typeof(Queryable),
            methodName,
            new Type[] { typeof(T), property.Type },
            query.Expression,
            Expression.Quote(sortLambda)
        );

        return query.Provider.CreateQuery<T>(resultExp);
    }
}
