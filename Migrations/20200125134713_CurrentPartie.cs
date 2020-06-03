using Microsoft.EntityFrameworkCore.Migrations;

namespace ProjetTp1.Migrations
{
    public partial class CurrentPartie : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CurrentPartie",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdJoueur = table.Column<int>(nullable: false),
                    ListeVerbes = table.Column<string>(nullable: true),
                    RangListe = table.Column<int>(nullable: false),
                    EnCours = table.Column<bool>(nullable: false),
                    Difficulty = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CurrentPartie", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CurrentPartie");
        }
    }
}
