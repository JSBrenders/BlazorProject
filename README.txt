English Battle - Beta

requis : 


- ASP.NET CORE 3.1


--- Entity Framework Core ---

Version 2.4.0.0

SQL Server Compact 4.0 in GAC - No
SQL Server Compact 4.0 DbProvider - No

SQL Server Compact 4.0 DDEX provider - No
SQL Server Compact 4.0 Simple DDEX provider - Yes


SQLite ADO.NET Provider included: 1.0.109.0
SQLite EF6 DbProvider in GAC - No

System.Data.SQLite DDEX provider - No
SQLite Simple DDEX provider - Yes

------------------------------

Voici un r�capitulatif du projet :

- La cr�ation de ce site est vou�e � l'apprentissage et la pratique de Blazor. Il s'agit d'un jeu en ligne appel� English Battle. Le but est de mettre au d�fi sa 
connaissance des verbes irr�guliers anglais. 

- Le site se compose de 4 modules :	- l'authentification
									- l'inscription
									- les meilleurs scores
									- le jeu

- Le site est une SPA (Single Page App). Chaque module est construit de la m�me mani�re : un composant razor (/Pages) qui appelle des controllers (/Data/InterfaceDB)
et des services.

- La base de donn�es est g�n�r�e via les classes de mod�les (/Models) et EntityFramework (Startup.cs lignes 76 - Database.Migrate()). EF utilise le dernier script de 
migration g�n�r� (ProjetTp1ContextModelSnapshot.cs) pour construire la BDD (/Migrations).

- J'utilise beaucoup d'interop�rabilit� avec JavaScript : fonction JSRuntime.InvokeVoidAsync() (exemple /jeu/Battle.razor ligne 291) via l'injection de d�pendance JSRuntime 
(exemple /jeu/Battle.razor ligne 9)

- Lancer le site devrait suffire � cr�er la base de donn�es SQLServer si vous poss�dez un serveur local SQLServer (localdb)MSSQLLocalDB.
De m�me, cela va lancer les scripts de remplissage des verbes et villes via un script SQL stock� dans le projet (Migrations/Scripts donn�es).
Le premier lancement peut �tre assez long.

- Si une exception de type SQLServer se produit, v�rifiez la connection � votre base de donn�es locale MSSQLLocalDB.

Cr�dits : Jean-S�bastien BRENDERS
