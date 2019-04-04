<?php
  require_once "connect.php";

  $name = $_POST['name'];

  $stmt = $link->prepare("DELETE FROM factory WHERE name=?");
  $stmt->bind_param("s", $name);
  $stmt->execute();
  $stmt->close();

  $query = mysqli_query($link, "INSERT INTO updatelog(updated) VALUES ('1')");
  echo "deleted " . $name;

?>
