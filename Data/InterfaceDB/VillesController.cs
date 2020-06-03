using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetTp1.Model;
using ProjetTp1.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjetTp1.Data.InterfaceDB
{
    [Route("api/[controller]")]
    [ApiController]
    public class VillesController : ControllerBase
    {
        private readonly ProjetTp1Context _context;

        public VillesController(ProjetTp1Context context)
        {
            _context = context;
        }

        // GET: api/Villes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ville>>> GetVille()
        {
            return await _context.Ville.ToListAsync();
        }
        //Get villes par noms
        public async Task<IEnumerable<Ville>> GetVilleParNom(string nom)
        {
            return await Task.FromResult(_context.Ville.Where(x => x.nom.ToLower().StartsWith(nom.ToLower()) || x.codePostal.ToString().Contains(nom)).ToList());
            //return await Task.FromResult(_context.Ville.Where(x => x.nom.ToLower().Contains(nom.ToLower())).ToList());
        }

        public Ville GetVilleParId(int Id)
        {
            return _context.Ville.Find(Id);
        }

        // GET: api/Villes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ville>> GetVille(int id)
        {
            var ville = await _context.Ville.FindAsync(id);

            if (ville == null)
            {
                return NotFound();
            }

            return ville;
        }

        // PUT: api/Villes/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVille(int id, Ville ville)
        {
            if (id != ville.Id)
            {
                return BadRequest();
            }

            _context.Entry(ville).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VilleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Villes
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Ville>> PostVille(Ville ville)
        {
            _context.Ville.Add(ville);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVille", new { id = ville.Id }, ville);
        }

        // DELETE: api/Villes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Ville>> DeleteVille(int id)
        {
            var ville = await _context.Ville.FindAsync(id);
            if (ville == null)
            {
                return NotFound();
            }

            _context.Ville.Remove(ville);
            await _context.SaveChangesAsync();

            return ville;
        }

        private bool VilleExists(int id)
        {
            return _context.Ville.Any(e => e.Id == id);
        }
    }
}
