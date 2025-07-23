using System;

namespace Backend.Domain.Exceptions;

public class ConflictingDataException : Exception
{
    public ConflictingDataException(string message)
        : base(message) { }
}
