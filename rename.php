<?php
  require_once "connect.php";

  $currentName = $_POST['currentName'];
  $newName = $_POST['newName'];

  $stmt = $link->prepare("SELECT name FROM factory WHERE name=?");
  $stmt->bind_param("s", $currentName);
  $stmt->execute();
  $result = $stmt->get_result();
  $stmt->close();

  if(mysqli_num_rows($result) > 0){
    //replace name
    $stmt = $link->prepare("UPDATE factory SET name=? WHERE name=?");
    $stmt->bind_param("ss", $newName, $currentName);
    $stmt->execute();
    $stmt->close();
    echo "Renamed '" . $currentName . "' to '" . $newName . "'";
    $query = mysqli_query($link, "INSERT INTO updatelog(updated) VALUES ('1')");
  }

  exit();
?>
