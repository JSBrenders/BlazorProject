using Microsoft.EntityFrameworkCore.Migrations;

namespace ProjetTp1.Migrations
{
    public partial class Continuev : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdPartie",
                table: "CurrentPartie",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdPartie",
                table: "CurrentPartie");
        }
    }
}
