import * as fs from "fs";
import * as path from "path";
import * as events from "events";
import * as readline from "readline";

/**
 * Markdown handler, create an interface to read and find a line that starts with `title:`
 * then the event it's resolved by extracting the line and put on a object: { md: STRING, title: STRING }
 * @date 7/12/2023
 *
 * @param {string} md_directory - relative path for markdown files
 * @param {string} md_name - current name of markdown file
 * @returns {*}
 */
function md_handler(md_directory: string, md_name: string) {
  return new Promise((resolve, _) => {
		const read_interface = readline.createInterface({
      input: fs.createReadStream(path.join(md_directory, md_name), {
        autoClose: true,
      }),
    });

    read_interface.on("line", (line: any) => {
      if (line.startsWith("title:")) {
        events.once(read_interface, "close");
        resolve({
          md: md_name,
          title: line.replace(/^title: "+|"+$|\$+$/g, "").trim(),
        });
      }
    });
  });
}

/**
 * Markdown wrapper, create a set of promises
 * @date 7/12/2023
 *
 * @async
 * @param {string} md_directory - relative path for markdown files
 * @param {string[]} md_list_raw - an array with markdown files raw name
 * @returns {*}
 */
async function md_wrapper(md_directory: string, md_list_raw: string[]) {
  const promises = md_list_raw.map((md_name: string) => {
    return md_handler.bind(this, md_directory, md_name);
  });

  return await Promise.all(promises.map((pm: any) => pm()));
}

/**
 * entry point function
 * @date 7/12/2023
 *
 * @export
 * @async
 * @param {string} markdown_directory - relative path for markdown files
 * @returns {Promise<any>}
 */
export default async function(markdown_directory: string): Promise<any> {
  // get list with markdown files name
  let list_raw_md = fs.readdirSync(markdown_directory);

  // drop out index.md file from list
  list_raw_md = list_raw_md.filter(function(md: string) {
    return md.trim().toLowerCase() !== "index.md";
  });

  return md_wrapper(markdown_directory, list_raw_md).then((results) => {
    return results.reverse().map((item) => {
      return {
        text: item.title,
        link: `/posts/${item.md.replace(/\.md$/g, ".html")}`,
      };
    });
  });
}
