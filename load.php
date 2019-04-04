<?php
  require_once "connect.php";

  $query = mysqli_query($link, "SELECT * FROM factory");
  $rows = array();
  while($r = mysqli_fetch_assoc($query)){
    $rows[] = $r;
  }

  echo json_encode($rows);
?>
