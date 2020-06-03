using Microsoft.EntityFrameworkCore;
using ProjetTp1.Model;

namespace ProjetTp1.Models
{
    public class ProjetTp1Context : DbContext
    {
        public ProjetTp1Context(DbContextOptions<ProjetTp1Context> options)
            : base(options)
        {
        }

        public DbSet<Joueur> Joueur { get; set; }

        public DbSet<Partie> Partie { get; set; }

        public DbSet<Ville> Ville { get; set; }

        public DbSet<Question> Question { get; set; }

        public DbSet<Verbe> Verbe { get; set; }

        public DbSet<CurrentPartie> CurrentPartie { get; set; }
    }
}
