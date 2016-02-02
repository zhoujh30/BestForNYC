<?php
    header('Access-Control-Allow-Origin:*');
    $file=file_get_contents("BestForNYC2.csv");
    echo $file;
    ?>