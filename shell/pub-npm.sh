git add .
git commit -m 'feat:upgrade'
git push origin master
npm version patch
npm pub
git push origin master