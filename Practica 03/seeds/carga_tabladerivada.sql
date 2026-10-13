LOAD DATA LOCAL INFILE 'C:\\Users\\SilverWolf\\Desktop\\Praticas_BDN_240709\\Practica 03\\seeds\\tb_product_categories.csv'
INTO TABLE tb_product_categories
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(
    product_Id,
    category_Id,
    @st,
    creation_date,
    last_update
)
SET
    status = IF(@st = '1', b'1', b'0');