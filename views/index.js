<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>RayhanADev</title>
    
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="style.css" type="text/css">
  </head>
  <body>
    <div class="hidden">
      <p>Hello, name's <%= data.profile.username %></p>
      <h2>My Stats</h2>
      <h4>Repl.it</h4>
      <p>* I have <%= data.profile.karma %> cycles, <%= data.posts %> posts, and <%= data.comments %> comments.</p>
      <% for(i in data.profile.languages) { %>
        <p>* I use <%= data.profile.languages[i].displayName %>.</p>
      <% } %>
      <h4>GitHub</h4>
      <img class="hiddenimg" src="https://github-readme-stats.vercel.app/api?username=RayhanADev"></img>
    </div>
    <script src="script.js" type="text/javascript"></script>
  </body>
</html>
