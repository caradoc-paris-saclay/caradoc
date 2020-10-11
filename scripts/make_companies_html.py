from os import walk
from os.path import abspath, join, dirname, basename

root_dir = dirname(dirname(abspath(__file__)))

def make_html_array(root_dir, companies_folder_relative_path, html_file):

    companies_folder = join(root_dir, companies_folder_relative_path)
    html = open(html_path, "w")
    
    buffer = {}
    
    for root, dirs, files in walk(companies_folder):
    
            for f in sorted(files, key=str.lower):
    
                    if "DS_Store" in f:
                            pass
                    else:
                            newroot = basename(root)
                            newroot = basename(root) if "TBC" in newroot else "Confirmed " + newroot
                            name = basename(f)
                            name = name[0].upper() + name[1:-4]
                            tbc_html = "" # "  <div class=center>On hold</div>\n" if "TBC" in newroot else ""
                            if "_" in name:
                                    name = name.replace("_", " ")
    
                            buffer[name]="<li class=\"mix " + newroot + "\">\n" +\
                                         "  <img src=\"{{ site.baseurl }}{% link " +\
                                            join(companies_folder_relative_path, 
                                                join(basename(root),basename(f))
                                                ) + " %}\" " +\
                                            "alt=\"" + name + "\">\n" +\
                                          tbc_html +\
                                          "</li>\n"
    
    for k in sorted(buffer.keys(), key=str.lower):
        html.write(buffer[k])
    html.close()


# For current edition

companies_folder_rel_path = "assets/img/companies"
html_path = join(root_dir, "_includes/companies_array.html")
make_html_array(root_dir, companies_folder_rel_path, html_path)

# For Previous Edition

companies_folder_rel_path = "assets/img/companies_old"
html_path = join(root_dir, "_includes/companies_array_previous_edition.html")
make_html_array(root_dir, companies_folder_rel_path, html_path)

