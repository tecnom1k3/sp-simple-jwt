<?php
chdir(dirname(__DIR__));

require_once('vendor/autoload.php');

use Zend\Config\Factory;

/*
 * Get all headers from the HTTP request
 */
$headers = getallheaders();

/*
 * Look for the 'authorization' header
 */
if (array_key_exists('Authorization', $headers)) {

    /*
     * Extract the jwt from the Bearer
     */
    list($jwt) = sscanf( $headers['Authorization'], 'Bearer %s');

    if ($jwt) {
        try {
            $config = Factory::fromFile('config/config.php', true);

            /*
             * decode the jwt using the key from config
             */
            $token = JWT::decode($jwt, $config->jwtKey);

            $asset = base64_encode(file_get_contents('assets/r34.png'));

            /*
             * return protected asset
             */
            header('Content-type: application/json');
            echo json_encode([
                'userId' => $token->id,
                'img'    => $asset
            ]);
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
}

