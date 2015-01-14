#JWT on PHP
 ---
 
##Disclaimer

By no means should this code ever be used in production ready applications nor be executed on production servers. No security checks and/or validations were enforced. This code was written for educational purposes only, having the scope to showcase basic functionality. Performance, efficiency, security, or reusability were not a priority.

##Install

Run `composer install` to install all the library dependencies.

Please create a config file `config/config.php` with the desired signing key and your MySQL database credentials.  You can use the file `config/config.php.dist` as a template.

Additionally create the following table in your database:

```
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
```

`id` and `username` fields should be pretty straight forward.  The `password` field has to be generated using the [`password_hash()`](http://php.net/manual/en/function.password-hash.php) function in PHP 