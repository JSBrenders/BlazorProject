namespace ProjetTp1.Model
{
    public class CurrentPartie
    {
        public int Id { get; set; }
        public int IdJoueur { get; set; }
        public string ListeVerbes { get; set; }
        public int RangListe { get; set; }
        public bool EnCours { get; set; }
        public int Difficulty { get; set; }
        public int IdPartie { get; set; }

    }
}
