using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domain.Models;
using Backend.Repositories.Implementations;

namespace Backend.Services;

public class UserService
{
    private readonly UserRepository _userRepository;

    public UserService(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }
}
