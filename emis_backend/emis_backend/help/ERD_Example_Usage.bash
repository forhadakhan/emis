# ERD Usage Example 
# Machine: Windows 10


# Create a dot file
$ python manage.py graph_models -a > my_project_erd.dot
$ python manage.py graph_models -a > my_project_erd.dot && python manage.py graph_models --pydot -a -g -o erd.png



# Create a PNG image file called my_project_visualized.png with application grouping
$ python manage.py graph_models -a -g -o my_project_visualized.png

# Same example but with explicit selection of pygraphviz or pydot
$ python manage.py graph_models --pygraphviz -a -g -o my_project_visualized.png
$ python manage.py graph_models --pydot -a -g -o my_project_visualized.png



# Create a dot file for only the 'foo' and 'bar' applications of your project
$ python manage.py graph_models foo bar > my_project.dot 



# Create a graph for only certain models
$ python manage.py graph_models -a -I User -o User_model_ERD.png 


# Create a graph excluding certain models
$ python manage.py graph_models -a -X Foo,Bar -o my_project_sans_foo_bar.png



# Create a graph including models matching a given pattern and excluding some of them
# It will first select the included ones, then filter out the ones to exclude
$ python manage.py graph_models -a -I Product* -X *Meta -o my_project_products_sans_meta.png



# Create a graph without showing its edges' labels
$ python manage.py graph_models -a --hide-edge-labels -o my_project_sans_foo_bar.png 



# Create a graph with 'normal' arrow shape for relations
$ python manage.py graph_models -a --arrow-shape normal -o my_project_sans_foo_bar.png



# Create a graph with colored edges for relations with on_delete settings
$ python manage.py graph_models -a --color-code-deletions -o my_project_colored.png 



# Create a graph with different layout direction,
# supported directions: "TB", "LR", "BT", "RL"
$ python manage.py graph_models -a --rankdir BT -o my_project_sans_foo_bar.png 



