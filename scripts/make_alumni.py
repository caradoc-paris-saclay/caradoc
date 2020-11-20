from os import walk, listdir
from os.path import abspath, join, dirname, basename, isfile
from shutil import copyfile
import pandas as pd
import numpy as np
import unidecode

root_dir = dirname(dirname(abspath(__file__)))

card = """
<div class="col-xl-3 col-sm-6 mb-5">
          <div class="image-flip" >
              <div class="mainflip flip-0">
                  <div class="frontside">
                      <div class="card">
                          <div class="card-body text-center">
                              <p><img class=" img-fluid" src="{{ site.baseurl }}{% link IMG %}" alt="card image"></p>
                              <h4 class="card-title">FISRTNAME LASTNAME</h4>
                              <p class="card-text">Last Role: LASTROLE</p>
                              <p class="card-text">DATEBEGIN - DATEEND</p>
                              <!-- <a href="https://www.fiverr.com/share/qb8D02" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i></a> -->
                          </div>
                      </div>
                  </div>
                  <div class="backside">
                      <div class="card">
                          <div class="card-body text-center mt-4">
                              <h4 class="card-title">FIRSTNAME LASTNAME</h4>
                              <p class="card-text">Worked in:  
                                TEAMS
                              </p>
                              <ul class="list-inline">
                                  
                                  <li class="list-inline-item">
                                      <a class="social-icon text-xs-center" target="_blank" href="LINKEDIN">
                                          <i class="fa fa-linkedin"></i>
                                      </a>
                                  </li>
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
"""

def find_img(firstname, lastname):
    '''
    images is a list containing names of image files
    names correspond either to a firstname or a lastname
    the function returns the first match
    '''
    # unicode.unidecode -> to convert accents to ascii
    # lower -> cast to lower case
    # strip -> remove trailing white spaces
    global root_dir
    firstname = unidecode.unidecode(firstname.lower().strip())
    lastname = unidecode.unidecode(lastname.lower().strip())
    team = "assets/img/team"
    alumni = "assets/img/alumni"
    team_fp = join(root_dir, team)
    alumni_fp = join(root_dir, alumni)
    # if img in team -> cp to alumni
    for i in sorted(listdir(team_fp)):
        if lastname in i or firstname in i:
            dest = join(alumni_fp, i)
            if not isfile(dest):
                copyfile(join(team_fp, i), dest)
            return i # file found return
    # else seach in alumni
    for i in sorted(listdir(alumni_fp)):
        if lastname in i or firstname in i:
            return i # file found return

def make_html_array(excel_sheet, html_file):

    global root_dir
    html = open(html_path, "w")
    # use panda to read excel (1st tab)
    df = pd.read_excel(excel_sheet)
    # columns corresponding to the 
    col_team_start = 2
    col_team_stop = 9
    columns = df.columns.to_list()
    col_firstname = columns[0]
    col_lastname = columns[1]
    team_cols = df.columns[col_team_start:col_team_stop + 1].to_list()
    # last column containing data
    last_col_index = df.columns.to_list().index("Status")
    # we cut the dataframe after the last column which is supposed to be named "Status"
    if len(df.columns) >= last_col_index:
        df = df.drop(df.columns[last_col_index+1:], axis=1)
    # cut the dataframe to retain only the members == those with a status that is not empty
    # in the dataframe (df) empty == nan or nar => use pd.notnull()
    team_members = df[df["Status"].notnull()]
    # keep only alumni
    team_members = df[df["Status"] == "alumni"]
    # iterate over team members and fill html
    for index, row in team_members.iterrows():
        firstname =  row[col_firstname]
        lastname = row[col_lastname]
        # find image matching member
        img_name = find_img(firstname, lastname)
        if img_name is None:
            img_name = "no-avatar.png"
        print(row["First Name"], "-->", img_name)



        #buffer = "<li class=\"mix " + newroot + "\">\n" +\
        #                                 "  <img src=\"{{ site.baseurl }}{% link " +\
        #                                    join(companies_folder_relative_path, 
        #                                        join(basename(root),basename(f))
        #                                        ) + " %}\" " +\
        #                                    "alt=\"" + name + "\">\n" +\
        #                                  tbc_html +\
        #                                  "</li>\n"
        #html.write(buffer)

    

    
    #for root, dirs, files in walk(image_folder):
    #
    #        for f in sorted(files, key=str.lower):
    #
    #                if "DS_Store" in f:
    #                        pass
    #                else:
    #                        newroot = basename(root)
    #                        newroot = basename(root) if "TBC" in newroot else "Confirmed " + newroot
    #                        name = basename(f)
    #                        name = name[0].upper() + name[1:-4]
    #                        tbc_html = "" # "  <div class=center>On hold</div>\n" if "TBC" in newroot else ""
    #                        if "_" in name:
    #                                name = name.replace("_", " ")
    #
    #                        buffer[name]="<li class=\"mix " + newroot + "\">\n" +\
    #                                     "  <img src=\"{{ site.baseurl }}{% link " +\
    #                                        join(companies_folder_relative_path, 
    #                                            join(basename(root),basename(f))
    #                                            ) + " %}\" " +\
    #                                        "alt=\"" + name + "\">\n" +\
    #                                      tbc_html +\
    #                                      "</li>\n"
    
    #for k in sorted(buffer.keys(), key=str.lower):
    #    html.write(buffer[k])
    html.close()


# For current edition
csv_sheet_name = "Team_info_CARaDOC.xlsx"
csv_sheet_path = join(dirname(root_dir), csv_sheet_name)
html_path = join(root_dir, "_includes/alumni_array.html")
make_html_array(csv_sheet_path, html_path)



