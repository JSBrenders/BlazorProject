using Microsoft.Scripting.Hosting;
using System.Collections.Generic;
using IronPython.Hosting;
using System.Diagnostics;
using System;
using System.IO;
using Newtonsoft.Json;

namespace ProjetTp1.Data.PythonApps
{
    public class PythonApp
    {
        public static string LaunchEngine(dynamic data)
        {
            var engine = Python.CreateEngine(); // Extract Python language engine from their grasp
            var scope = engine.CreateScope(); // Introduce Python namespace (scope)
            var d = new Dictionary<string, object>
            {
                { "data", data}
            }; // Add some sample parameters. Notice that there is no need in specifically setting the object type, interpreter will do that part for us in the script properly with high probability

            scope.SetVariable("params", d); // This will be the name of the dictionary in python script, initialized with previously created .NET Dictionary
            ScriptSource source = engine.CreateScriptSourceFromFile(@"C:\Users\jeans\source\repos\Engine\Engine.py"); // Load the script
            object result = source.Execute(scope);
            var parameter = scope.GetVariable<string>("parameter"); // To get the finally set variable 'parameter' from the python script
            return parameter;
        }

        public static string LaunchExternalEngine(string data)
        {
            // full path of python interpreter 
            //string python = @"‪C:\Users\jeans\Documents\Project1\Log.txt";

            // python app to call 
            //P
            string myPythonApp = @"C:\Users\jeans\source\repos\Engine\Engine.py";
            //b
            //string myPythonApp = @"‪C:\Users\jeansebastien\source\repos\JSBrenders\Engine\Engine.py";
            //string myPythonApp = Path.Combine(Directory.GetCurrentDirectory(), @"Data\PythonApps\Engine.py");

            //"‪C:\\Users\\jeansebastien\\source\\repos\\JSBrenders\\Engine\\Engine.py";
            //string myPythonApp = @"‪‪C:\uest.py";


            string myString = "";
            // Create new process start info 
            ProcessStartInfo myProcessStartInfo = new("python.exe");

            // make sure we can read the output from stdout 
            myProcessStartInfo.UseShellExecute = false;
            myProcessStartInfo.RedirectStandardOutput = true;
            myProcessStartInfo.CreateNoWindow = true;
            // start python app with 3 arguments  
            // 1st arguments is pointer to itself,  
            // 2nd and 3rd are actual arguments we want to send 
            //myProcessStartInfo.FileName = python;
            //myProcessStartInfo.Arguments = myPythonApp + " " + JsonConvert.SerializeObject(data);
            myProcessStartInfo.Arguments = myPythonApp + " " + data;


            Process myProcess = new();
            // assign start information to the process 
            myProcess.StartInfo = myProcessStartInfo;

            //Console.WriteLine("Calling Python script with arguments {0} and {1}", x, y);
            //Console.WriteLine(myPythonApp);

            // start the process 
            try
            {
                myProcess.Start();
                // Read the standard output of the app we called.  
                // in order to avoid deadlock we will read output first 
                // and then wait for process terminate: 
                StreamReader myStreamReader = myProcess.StandardOutput;
                myString = myStreamReader.ReadToEnd();

                /*if you need to read multiple lines, you might use: 
                    string myString = myStreamReader.ReadToEnd() */

                // wait exit signal from the app we called and then close it. 
                myProcess.WaitForExit();
                myProcess.Close();

                // write the output we got from python app 
                Console.WriteLine("Value received from script: " + myString);
            }
            catch (System.ComponentModel.Win32Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }


            return myString;
        }
    }
}
