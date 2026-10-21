using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BozkurtMobilya.Api.Controllers.Common;

/// <summary>
/// Yalnızca yetkilendirilmiş yöneticilerin erişebileceği Controller'lar için temel sınıf.
/// Otomatik olarak [Authorize(Roles = "Admin")] yetkilendirmesi uygular.
/// </summary>
[Authorize(Roles = "Admin")]
public abstract class BaseAdminController : BaseApiController
{
}
