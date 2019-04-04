<?php
  require_once "connect.php";

  $name = $_POST['factoryName'];
  $totalChildren = $_POST['numOfChildren'];
  $lNumRange = $_POST['lNumRange'];
  $uNumRange = $_POST['uNumRange'];

  $stmt = $link->prepare("SELECT name FROM factory WHERE name=?");
  $stmt->bind_param("s", $name);
  $stmt->execute();
  $result = $stmt->get_result();
  $stmt->close();
  //$query = mysqli_query($link, "SELECT name FROM Factory WHERE name='$name'");

  $range = $lNumRange . "/" . $uNumRange;

  if(mysqli_num_rows($result) == 0){
    for ($i=0; $i<$totalChildren; $i++){
      $child = rand($lNumRange, $uNumRange);
      $stmt = $link->prepare("INSERT INTO factory(name, child, numRange) VALUES (?, ?, ?)");
      $stmt->bind_param("sis", $name, $child, $range);
      $stmt->execute();
      $stmt->close();
      $query = mysqli_query($link, "INSERT INTO updatelog(updated) VALUES ('1')");
      //$query = mysqli_query($link, "INSERT INTO Factory(name, child, numRange) VALUES ('$name', '$child', '$numRange')");
    }
    echo "Successfully created Factory";
  }
  else{
    $stmt = $link->prepare("DELETE FROM factory WHERE name=?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $stmt->close();
    //$query = mysqli_query($link, "DELETE FROM Factory WHERE name='$name'");

    for ($i=0; $i<$totalChildren; $i++){
      $child = rand($lNumRange, $uNumRange);
      $stmt = $link->prepare("INSERT INTO factory(name, child, numRange) VALUES (?, ?, ?)");
      $stmt->bind_param("sis", $name, $child, $range);
      $stmt->execute();
      $stmt->close();
      //$query = mysqli_query($link, "INSERT INTO Factory(name, child, numRange) VALUES ('$name', '$child', '$numRange')");
    }
    $query = mysqli_query($link, "INSERT INTO updatelog(updated) VALUES ('1')");
    echo "Replaced existing Factory with new values";
  }

?>
