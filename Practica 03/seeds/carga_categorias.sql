LOAD DATA LOCAL INFILE 'C:\\Users\\SilverWolf\\Desktop\\Praticas_BDN_240709\\Practica 03\\seeds\\categorias_ecommerce_100_.csv'
INTO TABLE tb_categories
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(
    ID,
    name,
    description,
    sup_id_category,
    @status
)
SET
    status = IF(@status = 1, b'1', b'0');