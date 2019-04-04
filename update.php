<?php
  require_once "connect.php";

  $timeout = 30;
  $now = time();

  while((time()-$now) < $timeout){
    $query = mysqli_query($link, "SELECT * FROM updatelog");
    $numRows = mysqli_num_rows($query);

    if($numRows > 0){
      $query = mysqli_query($link, "DELETE FROM updatelog");
      $query = mysqli_query($link, "SELECT * FROM factory");
      $rows = array();

      while($r = mysqli_fetch_assoc($query)){
        $rows[] = $r;
      }
      echo json_encode($rows);
      exit();
    }
  }

  die("Timed out");

?>
