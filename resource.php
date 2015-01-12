<?php
require_once('vendor/autoload.php');

use JWT;

$headers = getallheaders();

if (array_key_exists('authorization', $headers)) {
    $authorization = $headers['authorization'];
    list($jwt) = sscanf($authorization, 'Bearer %s');
    
    if ($jwt) {
        try {
            $token = JWT::decode($jwt, '89sdf98sd7a98f7a98sd');
            header('Content-type: application/json');
            echo json_encode(['userId' => $token->id]);
        } catch (Exception $e) {
            header('HTTP/1.0 401 Unauthorized');
        }
    } else {
        header('HTTP/1.0 400 Bad Request');
    }
} else {
    header('HTTP/1.0 400 Bad Request');
}

