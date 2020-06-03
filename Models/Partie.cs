using System.ComponentModel.DataAnnotations;

namespace ProjetTp1.Model
{
    public class Partie
    {
        [Required(ErrorMessage = "requis")]
        public int Id { get; set; }
        [Min(1)]
        public int IdJoueur { get; set; }
        public int Score { get; set; }
        public int Difficulty { get; set; }
    }
}
