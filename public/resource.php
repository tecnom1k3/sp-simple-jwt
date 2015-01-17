<?php
chdir(dirname(__DIR__));

require_once('vendor/autoload.php');

use Zend\Config\Config;
use Zend\Config\Factory;
use Zend\Http\PhpEnvironment\Request;

function validateToken($token, Config $config)
{
    if ($token->iss == $_SERVER['SERVER_NAME']) { // The token was issued by the current server
        if ($token->exp > time()) { // Token's expiration time has not been reached yet

            /*
             * Connect to the database to validate token's user
             */
            $dsn = 'mysql:host=' . $config->database->host . ';dbname=' . $config->database->name;
            $db = new PDO($dsn, $config->database->user, $config->database->password);
            $sql = <<<EOL
            SELECT Count(*) AS numUsers
            FROM   users
            WHERE  id = ?
                   AND username = ?
EOL;
            $stmt = $db->prepare($sql);
            $stmt->execute([
                $token->data->userId,
                $token->data->userName
            ]);
            $rs = $stmt->fetch();

            if ($rs['numUsers'] == 1) {
                return true;
            }
        }
    }
    throw new InvalidArgumentException('Invalid Token');
}

/*
 * Get all headers from the HTTP request
 */
$request = new Request();

$authHeader = $request->getHeader('authorization');

/*
 * Look for the 'authorization' header
 */
if ($authHeader) {
    /*
     * Extract the jwt from the Bearer
     */
    list($jwt) = sscanf( $authHeader->toString(), 'Authorization: Bearer %s');

    if ($jwt) {
        try {
            $config = Factory::fromFile('config/config.php', true);

            /*
             * decode the jwt using the key from config
             */
            $token = JWT::decode($jwt, $config->jwtKey);

            if (validateToken($token, $config)) {
                $asset = base64_encode(file_get_contents('http://lorempixel.com/200/300/cats/'));

                /*
                 * return protected asset
                 */
                header('Content-type: application/json');
                echo json_encode([
                    'img'    => $asset
                ]);
            }
        } catch (Exception $e) {
            /*
             * the token was not able to be decoded.
             * this is likely because the signature was not able to be verified (tampered token)
             */
            header('HTTP/1.0 401 Unauthorized');
        }
    } else {
        /*
         * No token was able to be extracted from the authorization header
         */
        header('HTTP/1.0 400 Bad Request');
    }
} else {
    /*
     * The request lacks the authorization token
     */
    header('HTTP/1.0 400 Bad Request');
    echo 'Token not found in request';
}

