<?php
chdir(dirname(__DIR__));

require_once('vendor/autoload.php');

use Zend\Config\Config;
use Zend\Config\Factory;
use Zend\Http\PhpEnvironment\Request;

/*
 * Get all headers from the HTTP request
 */
$request = new Request();

if ($request->isGet()) {
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
                $secretKey = base64_decode($config->get('jwt')->get('key'));
                
                $token = JWT::decode($jwt, $secretKey, [$config->get('jwt')->get('algorithm')]);

                $asset = base64_encode(file_get_contents('http://lorempixel.com/200/300/cats/'));

                /*
                 * return protected asset
                 */
                header('Content-type: application/json');
                echo json_encode([
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
        echo 'Token not found in request';
    }
} else {
    header('HTTP/1.0 405 Method Not Allowed');
}
