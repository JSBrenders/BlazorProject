using Microsoft.EntityFrameworkCore.Migrations;

namespace ProjetTp1.Migrations
{
    public partial class Update3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "reponseParticipant",
                table: "Question");

            migrationBuilder.RenameColumn(
                name: "reponsePreterit",
                table: "Question",
                newName: "ReponsePreterit");

            migrationBuilder.RenameColumn(
                name: "idVerbe",
                table: "Question",
                newName: "IdVerbe");

            migrationBuilder.RenameColumn(
                name: "idPartie",
                table: "Question",
                newName: "IdPartie");

            migrationBuilder.RenameColumn(
                name: "dateReponse",
                table: "Question",
                newName: "DateReponse");

            migrationBuilder.RenameColumn(
                name: "dateEnvoie",
                table: "Question",
                newName: "DateEnvoie");

            migrationBuilder.RenameColumn(
                name: "difficulty",
                table: "Partie",
                newName: "Difficulty");

            migrationBuilder.AddColumn<string>(
                name: "ReponseParticipe",
                table: "Question",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReponseParticipe",
                table: "Question");

            migrationBuilder.RenameColumn(
                name: "ReponsePreterit",
                table: "Question",
                newName: "reponsePreterit");

            migrationBuilder.RenameColumn(
                name: "IdVerbe",
                table: "Question",
                newName: "idVerbe");

            migrationBuilder.RenameColumn(
                name: "IdPartie",
                table: "Question",
                newName: "idPartie");

            migrationBuilder.RenameColumn(
                name: "DateReponse",
                table: "Question",
                newName: "dateReponse");

            migrationBuilder.RenameColumn(
                name: "DateEnvoie",
                table: "Question",
                newName: "dateEnvoie");

            migrationBuilder.RenameColumn(
                name: "Difficulty",
                table: "Partie",
                newName: "difficulty");

            migrationBuilder.AddColumn<string>(
                name: "reponseParticipant",
                table: "Question",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
