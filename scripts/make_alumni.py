###
# author: Arnaud Gallant
# date: 20th november 2020
#
# To run the script:
# you will need the file Alumni_CARaDOC_for_export.xlsx
# place the file just outside of the git project main folder
# it should look like this
# - Alumni_CARaDOC_for_export.xlsx
# - caradoc / 
#            - scripts
#            - assets
#            - ...
# then cd to the folder containing this script and run
# python make_alumni.py
#
###

from os import walk, listdir
from os.path import abspath, join, dirname, basename, isfile
from shutil import copyfile # to move images
import pandas as pd # to hand excel + parse content
import unidecode # to take care of accents in names

# root directory (root of the git project)
root_dir = dirname(dirname(abspath(__file__)))
# number of cards per row
n_cards_per_row = 4
# card template
card = """
        <div class="col-xl-3 col-sm-6 mb-5">
            <div class="image-flip" >
                <div class="mainflip flip-0">
                  <div class="frontside">
                      <div class="card">
                          <div class="card-body text-center">
                              <p><img class=" img-fluid" src="{{ site.baseurl }}{% link IMG %}" alt="card image"></p>
                              <h4 class="card-title">FIRSTNAME LASTNAME</h4>
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
                              <p class="card-text">Worked in: </br>TEAMS
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
        </div>"""

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

def get_team_fullnames(df, team_initials):
    '''
    get the fullnames of the teams provided the dataframe df mapping the original excel sheet
    and the list of initials to find.
    the excel should be built such as:
          COl 1 -   COL 2
    ROW 1 IN 1  - FULLNAME 1
    ROW 2 IN 2  - FULLNAME 2
    ...     ...         ...
    ROW N IN N  - FULLNAME N
    '''
    # search the column COL 1 of initials by looking for the 1st one
    res = df.eq(team_initials[0]).any(0)
    col1 = ""
    col2 = ""
    columns = df.columns.to_list()
    for i,c in enumerate(columns):
        if res[c]:
            col1 = c
            col2 = columns[i+1]
            break
    # get the rows of all the initials
    fullnames = {}
    for t in team_initials:
        # row of intial
        tmp = df.loc[df[col1] == t]
        # if search worked, copy adjecent cell in col2
        # else return empty string
        if len(tmp)>0:
            i = tmp.index[0]
            fullnames[t] = df[col2][i]
        else:
            fullnames[t] = ""
    return fullnames

def make_html_array(excel_sheet, html_file):

    global root_dir
    global n_cards_per_row
    global card
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
    # get dictionnary of {initials: fullnames} where initials match team_cols
    # This will be usefeul to convert team initials into full team names
    fullnames = get_team_fullnames(df, team_cols)
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
    len_alumni = len(team_members)
    print("len_alumni", len_alumni)
    n = 0

    for index, row in team_members.iterrows():
        tc = card
        firstname =  row[col_firstname]
        lastname = row[col_lastname]
        # find image matching member
        img_name = find_img(firstname, lastname)
        if img_name is None:
            img_name = "no-avatar.png"
        # print(firstname, "-->", img_name)
        date_begin = row["Joining Date"].month_name()
        date_begin = f"{date_begin} {row['Joining Date'].year}" if isinstance(date_begin, str) else ""
        date_end = row["Leaving Date"].month_name()
        date_end = f"{date_end} {row['Leaving Date'].year}" if isinstance(date_end, str) else ""
        # get the non empty columns
        teams = []
        last_role = "Officer"
        # check if the string is not equal to "" or filled with spaces
        for c in team_cols:
            if isinstance(row[c], str):
                if row[c].strip() != "":
                    teams.append(fullnames[c])
                    if c == "EM":
                        last_role = "Event Manager"
                    elif row[c] == "L":
                        last_role = fullnames[c] + " Team Leader"
                    elif row[c] == "O":
                        last_role = fullnames[c] + " Officer"
                    elif last_role == "Officer" and row[c] != "L" and row[c] != "C": 
                        last_role = fullnames[c] + " Officer"
        teams = "\n".join(teams)
        linkedin = row["LinkedIn"] if isinstance(row["LinkedIn"] , str) else ""

        tc = tc.replace("FIRSTNAME", firstname).replace("LASTNAME", lastname) \
               .replace("IMG", "assets/img/alumni/" + img_name) \
               .replace("DATEBEGIN", date_begin) \
               .replace("DATEEND", date_end) \
               .replace("TEAMS", teams) \
               .replace("LASTROLE", last_role) \
               .replace("LINKEDIN", linkedin)
        # add cols when completing a row
        #if n == 0:
        #    tc = """    <div class="row">""" + tc
        #elif n % n_cards_per_row == 0:
        #    tc = "\n" +tc
        #    tc = """\n    </div>\n    <div class="row">""" + tc 
        #elif n == len_alumni - 1:
        #    tc += """\n    </div>""" 
        html.write(tc)
        n += 1

    html.close()


# For current edition
csv_sheet_name = "Alumni_CARaDOC_for_export.xlsx"
csv_sheet_path = join(dirname(root_dir), csv_sheet_name)
html_path = join(root_dir, "_includes/alumni_array.html")
make_html_array(csv_sheet_path, html_path)



