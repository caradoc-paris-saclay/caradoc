from os import walk, listdir
from os.path import abspath, join, dirname, basename
import pandas as pd
import numpy as np
import unidecode

root_dir = dirname(dirname(abspath(__file__)))

def find_img(images, firstname, lastname):
    '''
    images is a list containing names of image files
    names correspond either to a firstname or a lastname
    the function returns the first match
    '''
    # unicode.unidecode -> to convert accents to ascii
    # lower -> cast to lower case
    # strip -> remove trailing white spaces
    firstname = unidecode.unidecode(firstname.lower().strip())
    lastname = unidecode.unidecode(lastname.lower().strip())
    for i in images:
        if lastname in i or firstname in i:
            return i

def make_html_array(root_dir, excel_sheet, image_folders, html_file):

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
    if not isinstance(image_folders, list):
        image_folders = [image_folders]
    image_names = []
    for d in image_folders:
         image_names += sorted([fn for fn in listdir(d)])
    print(image_names)
    # iterate over team members and fill html
    for index, row in team_members.iterrows():
        firstname =  row[col_firstname]
        lastname = row[col_lastname]
        # find image matching member
        img_name = find_img(image_names, firstname, lastname)
        if img_name is None:
            img_name = "no-avatar.png"
        print(row["First Name"], img_name)

    

    
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
image_folder_relpaths = ["assets/img/team", "assets/img/alumni"]
html_path = join(root_dir, "_includes/alumni_array.html")
image_folder = [join(root_dir, d) for d in image_folder_relpaths]
make_html_array(root_dir, csv_sheet_path, image_folder, html_path)



