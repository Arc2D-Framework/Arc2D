GETTING STARTED
====================
1. Create or Capture an .html file
2. Save as `index.html` in `src/applications/{MyFolderName}`
2. Add install block before `</head>` tag closes
3. Point `Config.NAMESPACE` (see below) to your
   Applications namespace.


    <head>
        <!--================= OPTIONAL WEBCOMPONENTS POLYFILL ===============-->
            <script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.2.2/webcomponents-loader.js"></script>

        <!--====================== COCOON INSTALL ===================-->
            <link rel="stylesheet" type="text/css" href="../../../resources/css/animate.css"/>
            <link rel="stylesheet" type="text/css" href="../../../resources/css/font-awesome.min.css"/>
            <link rel="stylesheet" type="text/css" href="../../../resources/css/fonts.css"/>
        
            <script src="../../../resources/constants.js"></script>
            <script src="../../../resources/session.js" charset="utf-8"></script>
            <script> Session = top.Session; </script>
            <script src="../../../-appconfig.js"></script>
            <script id="config">
                Config.NAMESPACE = "applications.Test"; 
            </script>
            <script src="../../../resources/routes.js"></script>
            <script src="../../../resources/labels.js"></script>
            <script src="../../../node_modules/od-cocoon/framework.src.js" charset="utf-8"></script> 
        <!--========================= END INSTALL =======================-->
    </head>



