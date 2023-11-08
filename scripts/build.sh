# Run From Where?
exclude_folders=(../container/ ../src/node_modules/ ../dist/ ../scripts/ ../archives/ ../db-scripts/)
echo ${exclude_folders[*]}

remove_dist () {
  echo "Removing Dist"
  rm=$(rm -rf "../container/dist")
  echo $rm
}

[ -d "../container/dist" ] && remove_dist
[ ! -d "../container/dist" ] && echo "Dist Does Not Exist"

mkdir ../container/dist

cp ../src/*.js ../container/dist
cp ../auth-and-run.sh ../container/dist/auth-and-run.sh
cp ../src/package.json ../container/dist/package.json

subdirs=$(echo ../src/*/)

for subdir in $subdirs
do
  if [[ ! " ${exclude_folders[*]} " =~ " ${subdir} " ]]; then
    echo "Copy $subdir"
    cp -R ${subdir%?} ../container/dist/
  fi
done

ls ../container/dist
#remove_dist	
