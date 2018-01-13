using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Security.Claims;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Auth0.AuthenticationApi;
using Web.Authorization;

namespace Web.Controllers
{
    public class UserController : Controller
    {
        private IConfiguration _config;

        public UserController(IConfiguration config)
        {
            _config = config;
        }

        [Authorize]
        [HttpGet("api/user")]
        public async Task<IActionResult> GetUser()
        {
            IActionResult response = Unauthorized();

            // We're not doing anything with this, but hey! It's useful to know where the user id lives
            var userId = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier).Value;

            // Retrieve the access_token claim which we saved in the OnTokenValidated event
            var accessToken = User.Claims.FirstOrDefault(c => c.Type == "access_token").Value;
            
            // If we have an access_token, then retrieve the user's information
            if (!string.IsNullOrEmpty(accessToken))
            {
                var domain = _config["Auth0:Domain"];
                var apiClient = new AuthenticationApiClient(domain);
                var userInfo = await apiClient.GetUserInfoAsync(accessToken);

                return Ok(userInfo);
            }

            return response;
        }

        [Authorize(Scopes.DoAdminThing)]
        [HttpGet("api/userDoAdminThing")]
        public IActionResult GetUserDoAdminThing()
        {
            return Ok("Admin endpoint");
        }
    }
}
