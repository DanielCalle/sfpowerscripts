import * as fs from "fs-extra";
import child_process = require("child_process");
import path = require("path");
import FetchAnArtifact from "./FetchAnArtifact";

export class FetchAnArtifactFromNPM implements FetchAnArtifact {
  
  constructor(
    private scope: string,
    private npmrcPath: string
  ) {
  }


  public fetchArtifact(
    packageName: string,
    artifactDirectory: string,
    version?:string
  ) {

    if (this.npmrcPath && !fs.existsSync(path.resolve(path.join(artifactDirectory,".npmrc")))) {

      try
      {
      fs.copyFileSync(this.npmrcPath, path.resolve(path.join(artifactDirectory,".npmrc")));
      }catch(error)
      {
        throw new Error("We were unable to find or copy the .npmrc file as provided due to "+error.message);
      }
      if (!fs.existsSync(path.resolve(path.join(artifactDirectory,"package.json")))) {
        // package json is required in the same directory as .npmrc
        fs.writeFileSync(path.resolve(path.join(artifactDirectory,"package.json")), "{}");
      }
    }


    // NPM package names must be lowercase
    packageName = packageName.toLowerCase();

    let cmd: string;
    if (this.scope)
      cmd = `npm pack @${this.scope}/${packageName}_sfpowerscripts_artifact`;
    else cmd = `npm pack ${packageName}_sfpowerscripts_artifact`;

    if(version)
       cmd += `@${version}`
  

    console.log(`Fetching ${packageName} using ${cmd}`);

    child_process.execSync(cmd, {
      cwd: artifactDirectory,
      stdio: "pipe",
    });
  }
}
