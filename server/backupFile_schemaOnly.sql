PGDMP      #                }            neondb    16.9    17.5     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16389    neondb    DATABASE     n   CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';
    DROP DATABASE neondb;
                     neondb_owner    false            �           0    0    DATABASE neondb    ACL     0   GRANT ALL ON DATABASE neondb TO neon_superuser;
                        neondb_owner    false    3527                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                     pg_database_owner    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                        pg_database_owner    false    4            �            1259    24577 
   deliveries    TABLE     �  CREATE TABLE public.deliveries (
    id integer NOT NULL,
    delivery_number text NOT NULL,
    purchase_order_id integer,
    vehicle_number text,
    driver_name text,
    driver_phone text,
    status text NOT NULL,
    scheduled_date timestamp without time zone,
    delivered_date timestamp without time zone,
    received_by text,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.deliveries;
       public         heap r       neondb_owner    false    4            �            1259    24576    deliveries_id_seq    SEQUENCE     �   CREATE SEQUENCE public.deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.deliveries_id_seq;
       public               neondb_owner    false    216    4            �           0    0    deliveries_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.deliveries_id_seq OWNED BY public.deliveries.id;
          public               neondb_owner    false    215            �            1259    24589    hospital_inventory    TABLE     �  CREATE TABLE public.hospital_inventory (
    id integer NOT NULL,
    hospital_id integer,
    medicine_id integer,
    current_stock integer DEFAULT 0 NOT NULL,
    reorder_point integer NOT NULL,
    max_stock integer NOT NULL,
    unit_cost numeric(10,2),
    batch_number text,
    expiry_date timestamp without time zone,
    last_updated timestamp without time zone DEFAULT now(),
    supplier text,
    location text
);
 &   DROP TABLE public.hospital_inventory;
       public         heap r       neondb_owner    false    4            �            1259    24588    hospital_inventory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.hospital_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.hospital_inventory_id_seq;
       public               neondb_owner    false    218    4            �           0    0    hospital_inventory_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.hospital_inventory_id_seq OWNED BY public.hospital_inventory.id;
          public               neondb_owner    false    217            �            1259    24600    hospital_users    TABLE     [  CREATE TABLE public.hospital_users (
    id integer NOT NULL,
    hospital_id integer,
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);
 "   DROP TABLE public.hospital_users;
       public         heap r       neondb_owner    false    4            �            1259    24599    hospital_users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.hospital_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.hospital_users_id_seq;
       public               neondb_owner    false    220    4            �           0    0    hospital_users_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.hospital_users_id_seq OWNED BY public.hospital_users.id;
          public               neondb_owner    false    219            �            1259    24613 	   hospitals    TABLE     �  CREATE TABLE public.hospitals (
    id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zip_code text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    license_number text NOT NULL,
    contact_person text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.hospitals;
       public         heap r       neondb_owner    false    4            �            1259    24612    hospitals_id_seq    SEQUENCE     �   CREATE SEQUENCE public.hospitals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.hospitals_id_seq;
       public               neondb_owner    false    4    222            �           0    0    hospitals_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.hospitals_id_seq OWNED BY public.hospitals.id;
          public               neondb_owner    false    221            �            1259    24626    medicine_categories    TABLE     s   CREATE TABLE public.medicine_categories (
    id integer NOT NULL,
    name text NOT NULL,
    description text
);
 '   DROP TABLE public.medicine_categories;
       public         heap r       neondb_owner    false    4            �            1259    24625    medicine_categories_id_seq    SEQUENCE     �   CREATE SEQUENCE public.medicine_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.medicine_categories_id_seq;
       public               neondb_owner    false    4    224            �           0    0    medicine_categories_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.medicine_categories_id_seq OWNED BY public.medicine_categories.id;
          public               neondb_owner    false    223            �            1259    24637 	   medicines    TABLE     �  CREATE TABLE public.medicines (
    id integer NOT NULL,
    name text NOT NULL,
    generic_name text NOT NULL,
    brand text NOT NULL,
    category_id integer,
    strength text NOT NULL,
    dosage_form text NOT NULL,
    unit_of_measure text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    brand_name text,
    route text,
    category text,
    hsn_code text,
    gst_percent numeric(5,2) DEFAULT '0'::numeric
);
    DROP TABLE public.medicines;
       public         heap r       neondb_owner    false    4            �            1259    24636    medicines_id_seq    SEQUENCE     �   CREATE SEQUENCE public.medicines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.medicines_id_seq;
       public               neondb_owner    false    226    4            �           0    0    medicines_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.medicines_id_seq OWNED BY public.medicines.id;
          public               neondb_owner    false    225            �            1259    24648    notifications    TABLE       CREATE TABLE public.notifications (
    id integer NOT NULL,
    type text NOT NULL,
    user_id integer NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    data jsonb,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);
 !   DROP TABLE public.notifications;
       public         heap r       neondb_owner    false    4            �            1259    24647    notifications_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.notifications_id_seq;
       public               neondb_owner    false    4    228            �           0    0    notifications_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;
          public               neondb_owner    false    227            �            1259    24659    order_items    TABLE     �   CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    medicine_id integer,
    quantity integer NOT NULL,
    unit_price numeric(10,2),
    total_price numeric(10,2),
    status text DEFAULT 'pending'::text NOT NULL
);
    DROP TABLE public.order_items;
       public         heap r       neondb_owner    false    4            �            1259    24658    order_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.order_items_id_seq;
       public               neondb_owner    false    4    230            �           0    0    order_items_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;
          public               neondb_owner    false    229            �            1259    24669    orders    TABLE       CREATE TABLE public.orders (
    id integer NOT NULL,
    order_number text NOT NULL,
    hospital_id integer,
    supplier_id integer,
    status text NOT NULL,
    priority text DEFAULT 'standard'::text NOT NULL,
    total_amount numeric(12,2),
    requested_by integer,
    approved_by integer,
    order_date timestamp without time zone DEFAULT now(),
    required_date timestamp without time zone NOT NULL,
    completed_date timestamp without time zone,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.orders;
       public         heap r       neondb_owner    false    4            �            1259    24668    orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.orders_id_seq;
       public               neondb_owner    false    232    4            �           0    0    orders_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
          public               neondb_owner    false    231            �            1259    24683    payments    TABLE     �  CREATE TABLE public.payments (
    id integer NOT NULL,
    payment_number text NOT NULL,
    purchase_order_id integer,
    hospital_id integer,
    supplier_id integer,
    amount numeric(12,2) NOT NULL,
    payment_method text NOT NULL,
    status text NOT NULL,
    due_date timestamp without time zone,
    paid_date timestamp without time zone,
    reference text,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.payments;
       public         heap r       neondb_owner    false    4            �            1259    24682    payments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.payments_id_seq;
       public               neondb_owner    false    234    4            �           0    0    payments_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;
          public               neondb_owner    false    233            �            1259    24695    purchase_orders    TABLE       CREATE TABLE public.purchase_orders (
    id integer NOT NULL,
    po_number text NOT NULL,
    order_id integer,
    quotation_id integer,
    hospital_id integer,
    supplier_id integer,
    status text NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    delivery_address text NOT NULL,
    expected_delivery_date timestamp without time zone,
    actual_delivery_date timestamp without time zone,
    created_by integer,
    confirmed_by integer,
    created_at timestamp without time zone DEFAULT now()
);
 #   DROP TABLE public.purchase_orders;
       public         heap r       neondb_owner    false    4            �            1259    24694    purchase_orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.purchase_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.purchase_orders_id_seq;
       public               neondb_owner    false    236    4            �           0    0    purchase_orders_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.purchase_orders_id_seq OWNED BY public.purchase_orders.id;
          public               neondb_owner    false    235            �            1259    24707    quotation_items    TABLE     3  CREATE TABLE public.quotation_items (
    id integer NOT NULL,
    quotation_id integer,
    medicine_id integer,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    availability text DEFAULT 'available'::text NOT NULL,
    lead_time integer
);
 #   DROP TABLE public.quotation_items;
       public         heap r       neondb_owner    false    4            �            1259    24706    quotation_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.quotation_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.quotation_items_id_seq;
       public               neondb_owner    false    238    4            �           0    0    quotation_items_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.quotation_items_id_seq OWNED BY public.quotation_items.id;
          public               neondb_owner    false    237            �            1259    24717 
   quotations    TABLE     �  CREATE TABLE public.quotations (
    id integer NOT NULL,
    quotation_number text NOT NULL,
    order_id integer,
    supplier_id integer,
    hospital_id integer,
    status text NOT NULL,
    valid_until timestamp without time zone NOT NULL,
    total_amount numeric(12,2),
    delivery_terms text,
    payment_terms text,
    notes text,
    submitted_at timestamp without time zone,
    responded_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.quotations;
       public         heap r       neondb_owner    false    4            �            1259    24716    quotations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.quotations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.quotations_id_seq;
       public               neondb_owner    false    240    4            �           0    0    quotations_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.quotations_id_seq OWNED BY public.quotations.id;
          public               neondb_owner    false    239            �            1259    24729    supplier_inventory    TABLE     �  CREATE TABLE public.supplier_inventory (
    id integer NOT NULL,
    supplier_id integer,
    medicine_id integer,
    available_stock integer DEFAULT 0 NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    min_order_quantity integer DEFAULT 1 NOT NULL,
    batch_number text,
    expiry_date timestamp without time zone,
    is_active boolean DEFAULT true,
    last_updated timestamp without time zone DEFAULT now()
);
 &   DROP TABLE public.supplier_inventory;
       public         heap r       neondb_owner    false    4            �            1259    24728    supplier_inventory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.supplier_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.supplier_inventory_id_seq;
       public               neondb_owner    false    242    4            �           0    0    supplier_inventory_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.supplier_inventory_id_seq OWNED BY public.supplier_inventory.id;
          public               neondb_owner    false    241            �            1259    24742    supplier_users    TABLE     [  CREATE TABLE public.supplier_users (
    id integer NOT NULL,
    supplier_id integer,
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);
 "   DROP TABLE public.supplier_users;
       public         heap r       neondb_owner    false    4            �            1259    24741    supplier_users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.supplier_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.supplier_users_id_seq;
       public               neondb_owner    false    244    4            �           0    0    supplier_users_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.supplier_users_id_seq OWNED BY public.supplier_users.id;
          public               neondb_owner    false    243            �            1259    24755 	   suppliers    TABLE     �  CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zip_code text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    license_number text NOT NULL,
    contact_person text NOT NULL,
    payment_terms text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.suppliers;
       public         heap r       neondb_owner    false    4            �            1259    24754    suppliers_id_seq    SEQUENCE     �   CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.suppliers_id_seq;
       public               neondb_owner    false    4    246            �           0    0    suppliers_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;
          public               neondb_owner    false    245            �           2604    24580    deliveries id    DEFAULT     n   ALTER TABLE ONLY public.deliveries ALTER COLUMN id SET DEFAULT nextval('public.deliveries_id_seq'::regclass);
 <   ALTER TABLE public.deliveries ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    216    215    216            �           2604    24592    hospital_inventory id    DEFAULT     ~   ALTER TABLE ONLY public.hospital_inventory ALTER COLUMN id SET DEFAULT nextval('public.hospital_inventory_id_seq'::regclass);
 D   ALTER TABLE public.hospital_inventory ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    217    218    218            �           2604    24603    hospital_users id    DEFAULT     v   ALTER TABLE ONLY public.hospital_users ALTER COLUMN id SET DEFAULT nextval('public.hospital_users_id_seq'::regclass);
 @   ALTER TABLE public.hospital_users ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    220    219    220            �           2604    24616    hospitals id    DEFAULT     l   ALTER TABLE ONLY public.hospitals ALTER COLUMN id SET DEFAULT nextval('public.hospitals_id_seq'::regclass);
 ;   ALTER TABLE public.hospitals ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    222    221    222            �           2604    24629    medicine_categories id    DEFAULT     �   ALTER TABLE ONLY public.medicine_categories ALTER COLUMN id SET DEFAULT nextval('public.medicine_categories_id_seq'::regclass);
 E   ALTER TABLE public.medicine_categories ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    224    223    224            �           2604    24640    medicines id    DEFAULT     l   ALTER TABLE ONLY public.medicines ALTER COLUMN id SET DEFAULT nextval('public.medicines_id_seq'::regclass);
 ;   ALTER TABLE public.medicines ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    226    225    226            �           2604    24651    notifications id    DEFAULT     t   ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);
 ?   ALTER TABLE public.notifications ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    228    227    228            �           2604    24662    order_items id    DEFAULT     p   ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);
 =   ALTER TABLE public.order_items ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    230    229    230            �           2604    24672 	   orders id    DEFAULT     f   ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
 8   ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    232    231    232            �           2604    24686    payments id    DEFAULT     j   ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);
 :   ALTER TABLE public.payments ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    233    234    234            �           2604    24698    purchase_orders id    DEFAULT     x   ALTER TABLE ONLY public.purchase_orders ALTER COLUMN id SET DEFAULT nextval('public.purchase_orders_id_seq'::regclass);
 A   ALTER TABLE public.purchase_orders ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    235    236    236            �           2604    24710    quotation_items id    DEFAULT     x   ALTER TABLE ONLY public.quotation_items ALTER COLUMN id SET DEFAULT nextval('public.quotation_items_id_seq'::regclass);
 A   ALTER TABLE public.quotation_items ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    237    238    238            �           2604    24720    quotations id    DEFAULT     n   ALTER TABLE ONLY public.quotations ALTER COLUMN id SET DEFAULT nextval('public.quotations_id_seq'::regclass);
 <   ALTER TABLE public.quotations ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    239    240    240            �           2604    24732    supplier_inventory id    DEFAULT     ~   ALTER TABLE ONLY public.supplier_inventory ALTER COLUMN id SET DEFAULT nextval('public.supplier_inventory_id_seq'::regclass);
 D   ALTER TABLE public.supplier_inventory ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    242    241    242            �           2604    24745    supplier_users id    DEFAULT     v   ALTER TABLE ONLY public.supplier_users ALTER COLUMN id SET DEFAULT nextval('public.supplier_users_id_seq'::regclass);
 @   ALTER TABLE public.supplier_users ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    244    243    244            �           2604    24758    suppliers id    DEFAULT     l   ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);
 ;   ALTER TABLE public.suppliers ALTER COLUMN id DROP DEFAULT;
       public               neondb_owner    false    245    246    246            �           2606    24587 ,   deliveries deliveries_delivery_number_unique 
   CONSTRAINT     r   ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_delivery_number_unique UNIQUE (delivery_number);
 V   ALTER TABLE ONLY public.deliveries DROP CONSTRAINT deliveries_delivery_number_unique;
       public                 neondb_owner    false    216            �           2606    24585    deliveries deliveries_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.deliveries DROP CONSTRAINT deliveries_pkey;
       public                 neondb_owner    false    216            �           2606    24598 *   hospital_inventory hospital_inventory_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.hospital_inventory
    ADD CONSTRAINT hospital_inventory_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.hospital_inventory DROP CONSTRAINT hospital_inventory_pkey;
       public                 neondb_owner    false    218            �           2606    24609 "   hospital_users hospital_users_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.hospital_users
    ADD CONSTRAINT hospital_users_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.hospital_users DROP CONSTRAINT hospital_users_pkey;
       public                 neondb_owner    false    220            �           2606    24611 -   hospital_users hospital_users_username_unique 
   CONSTRAINT     l   ALTER TABLE ONLY public.hospital_users
    ADD CONSTRAINT hospital_users_username_unique UNIQUE (username);
 W   ALTER TABLE ONLY public.hospital_users DROP CONSTRAINT hospital_users_username_unique;
       public                 neondb_owner    false    220            �           2606    24624 )   hospitals hospitals_license_number_unique 
   CONSTRAINT     n   ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_license_number_unique UNIQUE (license_number);
 S   ALTER TABLE ONLY public.hospitals DROP CONSTRAINT hospitals_license_number_unique;
       public                 neondb_owner    false    222            �           2606    24622    hospitals hospitals_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.hospitals DROP CONSTRAINT hospitals_pkey;
       public                 neondb_owner    false    222            �           2606    24635 3   medicine_categories medicine_categories_name_unique 
   CONSTRAINT     n   ALTER TABLE ONLY public.medicine_categories
    ADD CONSTRAINT medicine_categories_name_unique UNIQUE (name);
 ]   ALTER TABLE ONLY public.medicine_categories DROP CONSTRAINT medicine_categories_name_unique;
       public                 neondb_owner    false    224            �           2606    24633 ,   medicine_categories medicine_categories_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.medicine_categories
    ADD CONSTRAINT medicine_categories_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.medicine_categories DROP CONSTRAINT medicine_categories_pkey;
       public                 neondb_owner    false    224            �           2606    24646    medicines medicines_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.medicines DROP CONSTRAINT medicines_pkey;
       public                 neondb_owner    false    226            �           2606    24657     notifications notifications_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public                 neondb_owner    false    228            �           2606    24667    order_items order_items_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
       public                 neondb_owner    false    230            �           2606    24681 !   orders orders_order_number_unique 
   CONSTRAINT     d   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);
 K   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_order_number_unique;
       public                 neondb_owner    false    232            �           2606    24679    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public                 neondb_owner    false    232                        2606    24693 '   payments payments_payment_number_unique 
   CONSTRAINT     l   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_payment_number_unique UNIQUE (payment_number);
 Q   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_payment_number_unique;
       public                 neondb_owner    false    234                       2606    24691    payments payments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public                 neondb_owner    false    234                       2606    24703 $   purchase_orders purchase_orders_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.purchase_orders DROP CONSTRAINT purchase_orders_pkey;
       public                 neondb_owner    false    236                       2606    24705 0   purchase_orders purchase_orders_po_number_unique 
   CONSTRAINT     p   ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_po_number_unique UNIQUE (po_number);
 Z   ALTER TABLE ONLY public.purchase_orders DROP CONSTRAINT purchase_orders_po_number_unique;
       public                 neondb_owner    false    236                       2606    24715 $   quotation_items quotation_items_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.quotation_items
    ADD CONSTRAINT quotation_items_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.quotation_items DROP CONSTRAINT quotation_items_pkey;
       public                 neondb_owner    false    238            
           2606    24725    quotations quotations_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.quotations DROP CONSTRAINT quotations_pkey;
       public                 neondb_owner    false    240                       2606    24727 -   quotations quotations_quotation_number_unique 
   CONSTRAINT     t   ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_quotation_number_unique UNIQUE (quotation_number);
 W   ALTER TABLE ONLY public.quotations DROP CONSTRAINT quotations_quotation_number_unique;
       public                 neondb_owner    false    240                       2606    24740 *   supplier_inventory supplier_inventory_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.supplier_inventory
    ADD CONSTRAINT supplier_inventory_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.supplier_inventory DROP CONSTRAINT supplier_inventory_pkey;
       public                 neondb_owner    false    242                       2606    24751 "   supplier_users supplier_users_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.supplier_users
    ADD CONSTRAINT supplier_users_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.supplier_users DROP CONSTRAINT supplier_users_pkey;
       public                 neondb_owner    false    244                       2606    24753 -   supplier_users supplier_users_username_unique 
   CONSTRAINT     l   ALTER TABLE ONLY public.supplier_users
    ADD CONSTRAINT supplier_users_username_unique UNIQUE (username);
 W   ALTER TABLE ONLY public.supplier_users DROP CONSTRAINT supplier_users_username_unique;
       public                 neondb_owner    false    244                       2606    24766 )   suppliers suppliers_license_number_unique 
   CONSTRAINT     n   ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_license_number_unique UNIQUE (license_number);
 S   ALTER TABLE ONLY public.suppliers DROP CONSTRAINT suppliers_license_number_unique;
       public                 neondb_owner    false    246                       2606    24764    suppliers suppliers_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.suppliers DROP CONSTRAINT suppliers_pkey;
       public                 neondb_owner    false    246                       2606    24767 =   deliveries deliveries_purchase_order_id_purchase_orders_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_purchase_order_id_purchase_orders_id_fk FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id);
 g   ALTER TABLE ONLY public.deliveries DROP CONSTRAINT deliveries_purchase_order_id_purchase_orders_id_fk;
       public               neondb_owner    false    216    3332    236                       2606    24772 A   hospital_inventory hospital_inventory_hospital_id_hospitals_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.hospital_inventory
    ADD CONSTRAINT hospital_inventory_hospital_id_hospitals_id_fk FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id);
 k   ALTER TABLE ONLY public.hospital_inventory DROP CONSTRAINT hospital_inventory_hospital_id_hospitals_id_fk;
       public               neondb_owner    false    222    3312    218                       2606    24777 A   hospital_inventory hospital_inventory_medicine_id_medicines_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.hospital_inventory
    ADD CONSTRAINT hospital_inventory_medicine_id_medicines_id_fk FOREIGN KEY (medicine_id) REFERENCES public.medicines(id);
 k   ALTER TABLE ONLY public.hospital_inventory DROP CONSTRAINT hospital_inventory_medicine_id_medicines_id_fk;
       public               neondb_owner    false    3318    218    226                       2606    24782 9   hospital_users hospital_users_hospital_id_hospitals_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.hospital_users
    ADD CONSTRAINT hospital_users_hospital_id_hospitals_id_fk FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id);
 c   ALTER TABLE ONLY public.hospital_users DROP CONSTRAINT hospital_users_hospital_id_hospitals_id_fk;
       public               neondb_owner    false    3312    220    222                       2606    24787 9   medicines medicines_category_id_medicine_categories_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_category_id_medicine_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.medicine_categories(id);
 c   ALTER TABLE ONLY public.medicines DROP CONSTRAINT medicines_category_id_medicine_categories_id_fk;
       public               neondb_owner    false    3316    226    224                       2606    24797 3   order_items order_items_medicine_id_medicines_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_medicine_id_medicines_id_fk FOREIGN KEY (medicine_id) REFERENCES public.medicines(id);
 ]   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_medicine_id_medicines_id_fk;
       public               neondb_owner    false    226    3318    230                       2606    24792 -   order_items order_items_order_id_orders_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id);
 W   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_order_id_orders_id_fk;
       public               neondb_owner    false    3326    230    232                       2606    24817 .   orders orders_approved_by_hospital_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_approved_by_hospital_users_id_fk FOREIGN KEY (approved_by) REFERENCES public.hospital_users(id);
 X   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_approved_by_hospital_users_id_fk;
       public               neondb_owner    false    220    232    3306                       2606    24802 )   orders orders_hospital_id_hospitals_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_hospital_id_hospitals_id_fk FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id);
 S   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_hospital_id_hospitals_id_fk;
       public               neondb_owner    false    222    232    3312                        2606    24812 /   orders orders_requested_by_hospital_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_requested_by_hospital_users_id_fk FOREIGN KEY (requested_by) REFERENCES public.hospital_users(id);
 Y   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_requested_by_hospital_users_id_fk;
       public               neondb_owner    false    220    232    3306            !           2606    24807 )   orders orders_supplier_id_suppliers_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_supplier_id_suppliers_id_fk FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);
 S   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_supplier_id_suppliers_id_fk;
       public               neondb_owner    false    246    232    3350            "           2606    24827 -   payments payments_hospital_id_hospitals_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_hospital_id_hospitals_id_fk FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id);
 W   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_hospital_id_hospitals_id_fk;
       public               neondb_owner    false    3312    222    234            #           2606    24822 9   payments payments_purchase_order_id_purchase_orders_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_purchase_order_id_purchase_orders_id_fk FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id);
 c   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_purchase_order_id_purchase_orders_id_fk;
       public               neondb_owner    false    236    234    3332            $           2606    24832 -   payments payments_supplier_id_suppliers_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_supplier_id_suppliers_id_fk FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);
 W   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_supplier_id_suppliers_id_fk;
       public               neondb_owner    false    3350    246    234            %           2606    24862 A   purchase_orders purchase_orders_confirmed_by_supplier_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_confirmed_by_supplier_users_id_fk FOREIGN KEY (confirmed_by) REFERENCES public.supplier_users(id);
 k   ALTER TABLE ONLY public.purchase_orders DROP CONSTRAINT purchase_orders_confirmed_by_supplier_users_id_fk;
       public               neondb_owner    false    244    236    3344            &           2606    24857 ?   purchase_orders purchase_orders_created_by_hospital_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_created_by_hospital_users_id_fk FOREIGN KEY (created_by) REFERENCES public.hospital_users(id);
 i   ALTER TABLE ONLY public.purchase_orders DROP CONSTRAINT purchase_orders_created_by_hospital_users_id_fk;
       public               neondb_owner    false    3306    236    220            '           2606    24847 ;   purchase_orders purchase_orders_hospital_id_hospitals_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_hospital_id_hospitals_id_fk FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id);
 e   ALTER TABLE ONLY public.purchase_orders DROP CONSTRAINT purchase_orders_hospital_id_hospitals_id_fk;
       public               neondb_owner    false    222    3312    236            (           2606    24837 5   purchase_orders purchase_orders_order_id_orders_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id);
 _   ALTER TABLE ONLY public.purchase_orders DROP CONSTRAINT purchase_orders_order_id_orders_id_fk;
       public               neondb_owner    false    236    232    3326            )           2606    24842 =   purchase_orders purchase_orders_quotation_id_quotations_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_quotation_id_quotations_id_fk FOREIGN KEY (quotation_id) REFERENCES public.quotations(id);
 g   ALTER TABLE ONLY public.purchase_orders DROP CONSTRAINT purchase_orders_quotation_id_quotations_id_fk;
       public               neondb_owner    false    236    240    3338            *           2606    24852 ;   purchase_orders purchase_orders_supplier_id_suppliers_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_supplier_id_suppliers_id_fk FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);
 e   ALTER TABLE ONLY public.purchase_orders DROP CONSTRAINT purchase_orders_supplier_id_suppliers_id_fk;
       public               neondb_owner    false    246    3350    236            +           2606    24872 ;   quotation_items quotation_items_medicine_id_medicines_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.quotation_items
    ADD CONSTRAINT quotation_items_medicine_id_medicines_id_fk FOREIGN KEY (medicine_id) REFERENCES public.medicines(id);
 e   ALTER TABLE ONLY public.quotation_items DROP CONSTRAINT quotation_items_medicine_id_medicines_id_fk;
       public               neondb_owner    false    238    3318    226            ,           2606    24867 =   quotation_items quotation_items_quotation_id_quotations_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.quotation_items
    ADD CONSTRAINT quotation_items_quotation_id_quotations_id_fk FOREIGN KEY (quotation_id) REFERENCES public.quotations(id);
 g   ALTER TABLE ONLY public.quotation_items DROP CONSTRAINT quotation_items_quotation_id_quotations_id_fk;
       public               neondb_owner    false    240    238    3338            -           2606    24887 1   quotations quotations_hospital_id_hospitals_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_hospital_id_hospitals_id_fk FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id);
 [   ALTER TABLE ONLY public.quotations DROP CONSTRAINT quotations_hospital_id_hospitals_id_fk;
       public               neondb_owner    false    240    222    3312            .           2606    24877 +   quotations quotations_order_id_orders_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id);
 U   ALTER TABLE ONLY public.quotations DROP CONSTRAINT quotations_order_id_orders_id_fk;
       public               neondb_owner    false    240    232    3326            /           2606    24882 1   quotations quotations_supplier_id_suppliers_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_supplier_id_suppliers_id_fk FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);
 [   ALTER TABLE ONLY public.quotations DROP CONSTRAINT quotations_supplier_id_suppliers_id_fk;
       public               neondb_owner    false    246    240    3350            0           2606    24897 A   supplier_inventory supplier_inventory_medicine_id_medicines_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.supplier_inventory
    ADD CONSTRAINT supplier_inventory_medicine_id_medicines_id_fk FOREIGN KEY (medicine_id) REFERENCES public.medicines(id);
 k   ALTER TABLE ONLY public.supplier_inventory DROP CONSTRAINT supplier_inventory_medicine_id_medicines_id_fk;
       public               neondb_owner    false    242    3318    226            1           2606    24892 A   supplier_inventory supplier_inventory_supplier_id_suppliers_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.supplier_inventory
    ADD CONSTRAINT supplier_inventory_supplier_id_suppliers_id_fk FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);
 k   ALTER TABLE ONLY public.supplier_inventory DROP CONSTRAINT supplier_inventory_supplier_id_suppliers_id_fk;
       public               neondb_owner    false    246    242    3350            2           2606    24902 9   supplier_users supplier_users_supplier_id_suppliers_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.supplier_users
    ADD CONSTRAINT supplier_users_supplier_id_suppliers_id_fk FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);
 c   ALTER TABLE ONLY public.supplier_users DROP CONSTRAINT supplier_users_supplier_id_suppliers_id_fk;
       public               neondb_owner    false    3350    246    244            B           826    16392     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     {   ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;
          public               cloud_admin    false    4            A           826    16391    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     �   ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO neon_superuser WITH GRANT OPTION;
          public               cloud_admin    false    4           