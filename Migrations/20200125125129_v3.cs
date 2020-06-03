using Microsoft.EntityFrameworkCore.Migrations;

namespace ProjetTp1.Migrations
{
    public partial class v3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "score",
                table: "Partie",
                newName: "Score");

            migrationBuilder.RenameColumn(
                name: "idJoueur",
                table: "Partie",
                newName: "IdJoueur");

            migrationBuilder.AlterColumn<string>(
                name: "reponsePreterit",
                table: "Question",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "reponseParticipant",
                table: "Question",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Score",
                table: "Partie",
                newName: "score");

            migrationBuilder.RenameColumn(
                name: "IdJoueur",
                table: "Partie",
                newName: "idJoueur");

            migrationBuilder.AlterColumn<string>(
                name: "reponsePreterit",
                table: "Question",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "reponseParticipant",
                table: "Question",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));
        }
    }
}
