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

Voici un récapitulatif du projet :

- La création de ce site est vouée à l'apprentissage et la pratique de Blazor. Il s'agit d'un jeu en ligne appelé English Battle. Le but est de mettre au défi sa 
connaissance des verbes irréguliers anglais. 

- Le site se compose de 4 modules :	- l'authentification
									- l'inscription
									- les meilleurs scores
									- le jeu

- Le site est une SPA (Single Page App). Chaque module est construit de la même manière : un composant razor (/Pages) qui appelle des controllers (/Data/InterfaceDB)
et des services.

- La base de données est générée via les classes de modèles (/Models) et EntityFramework (Startup.cs lignes 76 - Database.Migrate()). EF utilise le dernier script de 
migration généré (ProjetTp1ContextModelSnapshot.cs) pour construire la BDD (/Migrations).

- J'utilise beaucoup d'interopérabilité avec JavaScript : fonction JSRuntime.InvokeVoidAsync() (exemple /jeu/Battle.razor ligne 291) via l'injection de dépendance JSRuntime 
(exemple /jeu/Battle.razor ligne 9)

- Lancer le site devrait suffire à créer la base de données SQLServer si vous possédez un serveur local SQLServer (localdb)MSSQLLocalDB.
De même, cela va lancer les scripts de remplissage des verbes et villes via un script SQL stocké dans le projet (Migrations/Scripts données).
Le premier lancement peut être assez long.

- Si une exception de type SQLServer se produit, vérifiez la connection à votre base de données locale MSSQLLocalDB.

Crédits : Jean-Sébastien BRENDERS
