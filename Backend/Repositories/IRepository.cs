using System.Linq.Expressions;

namespace Backend.Repositories;

public interface IRepository<T>
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

    T Create(T entity);
    void Delete(T entity);
    T Update(T entity);

    Task SaveAsync();
}
