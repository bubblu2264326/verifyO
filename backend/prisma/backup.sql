--
-- PostgreSQL database dump
--

\restrict dVzLdaFrkBGYoijfR9R6CdCr7LXdQ4I6GsZeJehiI8ox45YH0Z46ZmOZIbzkHGL

-- Dumped from database version 18.3 (Ubuntu 18.3-1.pgdg24.04+1)
-- Dumped by pg_dump version 18.3 (Ubuntu 18.3-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Document" (
    id text NOT NULL,
    "fileName" text NOT NULL,
    "fileHash" text NOT NULL,
    "storagePath" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Document" VALUES ('b4d7f2ca-db50-4dee-995f-f9c66760e28e', 'duplicate.pdf', '66714481a1d57b6033e12def49319da7944647fabbd3af05d446b9716d0df0f6', '/home/oops/projects/smb_test/backend/uploads/documents/1773494041179-duplicate.pdf', '00bddb6d-4577-4d27-b7ac-bc7f0091c37f', '2026-03-14 13:14:01.185');
INSERT INTO public."Document" VALUES ('30b7b6be-8472-4d4c-8e9b-0af1702c501d', 'Applied Machine Learning Quiz Spring 2025.pdf', '8a08ae55a5e1ead04641d559859dacf8a563faf1fb704eb5e6ccb7c4b03a871d', '/home/oops/projects/smb_test/backend/uploads/documents/1773552989749-Applied_Machine_Learning_Quiz_Spring_2025.pdf', '70e05f37-92d7-466a-a2ee-8e15b24d9f61', '2026-03-15 05:36:29.849');
INSERT INTO public."Document" VALUES ('5e957b38-b312-442d-b52b-0fc45e4d281e', 'FOM_assignment1_fixed.pdf', '04d387b5fc889e3952a86662ecbb98da9bed8d0532450309d2469f05470ad752', '/home/oops/projects/smb_test/backend/uploads/documents/1773557994904-FOM_assignment1_fixed.pdf', '70e05f37-92d7-466a-a2ee-8e15b24d9f61', '2026-03-15 06:59:54.927');
INSERT INTO public."Document" VALUES ('a0ed1b75-dfc3-41be-bf3c-9384489e9d87', 'Decision_Tree.pdf', '453be393ec1596326336cb4026074ac983b31bb1405fd2ed2ba224292029a8e1', '/home/oops/projects/smb_test/backend/uploads/documents/1773569487957-Decision_Tree.pdf', '70e05f37-92d7-466a-a2ee-8e15b24d9f61', '2026-03-15 10:11:28.021');
INSERT INTO public."Document" VALUES ('788f61d1-a435-44f0-9d25-f2a595d29438', 'FOM_assignment1_fixed.pdf', '04d387b5fc889e3952a86662ecbb98da9bed8d0532450309d2469f05470ad752', '/home/oops/projects/smb_test/backend/uploads/documents/1773500825358-FOM_assignment1_fixed.pdf', 'e604f0d3-3fc3-4a16-9214-419b16520e10', '2026-03-15 10:46:13.29');
INSERT INTO public."Document" VALUES ('84664e34-8f27-43af-b786-950cfebd09d5', 'Applied Machine Learning Quiz Spring 2025.pdf', '8a08ae55a5e1ead04641d559859dacf8a563faf1fb704eb5e6ccb7c4b03a871d', '/home/oops/projects/smb_test/backend/uploads/documents/1773552989749-Applied_Machine_Learning_Quiz_Spring_2025.pdf', '3ab979d7-6c59-4e24-8d97-0007f9b76f18', '2026-03-15 15:01:41.599');
INSERT INTO public."Document" VALUES ('100e39e6-5adb-4e74-9bc7-9a914e11a1ef', 'Gemini_Generated_Image_j648lsj648lsj648 (1).png', '89c45c9673b074c1205dac5512950eb4c862273ebb982c5671d9861c0423b907', '/home/oops/projects/smb_test/backend/uploads/documents/1eed067f-2777-4ff4-b797-b3f87544350d', 'e604f0d3-3fc3-4a16-9214-419b16520e10', '2026-03-15 15:11:13.844');
INSERT INTO public."Document" VALUES ('db437d76-f8b6-4d7d-bd4a-8f529b7aaccd', 'Gemini_Generated_Image_j648lsj648lsj648 (1).png', '89c45c9673b074c1205dac5512950eb4c862273ebb982c5671d9861c0423b907', '/home/oops/projects/smb_test/backend/uploads/documents/1eed067f-2777-4ff4-b797-b3f87544350d', 'e604f0d3-3fc3-4a16-9214-419b16520e10', '2026-03-15 15:21:28.109');
INSERT INTO public."Document" VALUES ('88800b8e-343b-4cf0-b118-532a8a9db11c', 'Gemini_Generated_Image_j648lsj648lsj648.png', 'a28abfbd66acbcecbbc9bcae7cdbbde509e72bc78207a7aba196906ff904b93b', '/home/oops/projects/smb_test/backend/uploads/documents/4b7a3560-92c1-490d-86f1-ecdf1de8f4de', '317620ed-375a-4454-bc37-7cd0bee0fa21', '2026-03-15 15:30:12.341');
INSERT INTO public."Document" VALUES ('8e134925-9376-4636-ba82-efca2c9bf071', 'Gemini_Generated_Image_j648lsj648lsj648.png', 'a28abfbd66acbcecbbc9bcae7cdbbde509e72bc78207a7aba196906ff904b93b', '/home/oops/projects/smb_test/backend/uploads/documents/4b7a3560-92c1-490d-86f1-ecdf1de8f4de', 'ffb8bb49-bfd1-4912-b13b-9796693245ef', '2026-03-15 18:31:14.831');
INSERT INTO public."Document" VALUES ('43597590-4729-4225-be60-9ff76d7c529c', 'file1.pdf', 'b920615b6f71a328ce5ecb49c527e09ef4cd5ec20067aff16ab125cdc5419ab6', '/home/oops/projects/smb_test/backend/uploads/documents/0da385a2-ede9-4ea5-ae9e-17fea05901f0', 'ebbbdc36-54d7-47db-b978-a9d55c9a51ca', '2026-03-16 05:40:45.89');
INSERT INTO public."Document" VALUES ('7cf8cdd8-6ae0-40ee-99dc-37e1f88f6186', 'Smiling woman in lush park setting.png', '400bbf3c6b081a9687d9f24ea88dc6443c2873c33e970ef0f5e9ab7aaf6e85c6', '/home/oops/projects/smb_test/backend/uploads/documents/45262971-2c14-4d17-9b96-bf933a61d56f', 'ebbbdc36-54d7-47db-b978-a9d55c9a51ca', '2026-03-16 06:02:50.389');
INSERT INTO public."Document" VALUES ('c93dfeb6-6f18-4a40-b8df-3332dd0ed786', 'file1.pdf', 'b920615b6f71a328ce5ecb49c527e09ef4cd5ec20067aff16ab125cdc5419ab6', '/home/oops/projects/smb_test/backend/uploads/documents/0da385a2-ede9-4ea5-ae9e-17fea05901f0', 'e0446430-ac32-45b9-a5e8-1b24a4ae05c2', '2026-03-16 07:37:25.202');
INSERT INTO public."Document" VALUES ('9e7db352-7090-4fe7-a684-20e97a7516a3', 'file1.pdf', 'b920615b6f71a328ce5ecb49c527e09ef4cd5ec20067aff16ab125cdc5419ab6', '/home/oops/projects/smb_test/backend/uploads/documents/0da385a2-ede9-4ea5-ae9e-17fea05901f0', 'eb3c8f82-6ead-4b0c-92f9-e04f62654f5f', '2026-03-16 07:40:43.26');
INSERT INTO public."Document" VALUES ('3f0c7b98-ad41-4c6a-b131-9304946014a3', 'Smiling woman in lush park setting.png', '400bbf3c6b081a9687d9f24ea88dc6443c2873c33e970ef0f5e9ab7aaf6e85c6', '/home/oops/projects/smb_test/backend/uploads/documents/45262971-2c14-4d17-9b96-bf933a61d56f', 'e604f0d3-3fc3-4a16-9214-419b16520e10', '2026-03-16 07:45:35.283');
INSERT INTO public."Document" VALUES ('2ff0c0a3-6d4f-46df-ae1c-8a378b09c7b0', 'Gemini_Generated_Image_ye7l6tye7l6tye7l (1).png', '7b78e0373d643ece94ae9c77d67235ecb4843dd8fc3c2b16743be4e81fa6ae7f', '/home/oops/projects/smb_test/backend/uploads/documents/d4e071a6-826f-4f1c-93c9-f98ecae7b3eb', 'e604f0d3-3fc3-4a16-9214-419b16520e10', '2026-03-16 08:11:03.3');
INSERT INTO public."Document" VALUES ('6e658ee8-e38e-40cb-892e-aa5f591c10b9', 'IMG_20251231_092533 (1).jpg', 'ec59451dd8b112d940ce7340ba744bdd9dc46c45b1d6ea980d88b440656966c8', '/home/oops/projects/smb_test/backend/uploads/documents/10917888-758b-408f-954f-d0a9816383bd', '9498c8bd-8257-4a61-a3a6-68fe1e11ef76', '2026-03-16 08:28:02.759');


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."User" VALUES ('226779a3-bba6-49ad-a71c-889f3e6fcebb', 'admin@example.com', '$2b$12$koxOyns6HwYT7Xu1VNCuee6Uawx4P3J2pbZOm2shSysyvrnZTskum', 'ADMIN', '2026-03-14 13:13:59.912', '2026-03-14 13:13:59.912');
INSERT INTO public."User" VALUES ('00bddb6d-4577-4d27-b7ac-bc7f0091c37f', 'first@example.com', '$2b$12$ua.PvP6RloMWKhFNRVvOo.iuHZK7Sw8zNT7eThrT2uRJv8EV29Vma', 'USER', '2026-03-14 13:14:00.256', '2026-03-14 13:14:00.256');
INSERT INTO public."User" VALUES ('d64b2096-0de5-4a7a-844f-3c6e890b282a', 'second@example.com', '$2b$12$iUseY0ply/I/u3xgZNglYux33EFAYqqKPSaubK9yg0Amxlo6T7tLu', 'USER', '2026-03-14 13:14:00.738', '2026-03-14 13:14:00.738');
INSERT INTO public."User" VALUES ('c4313cc4-a83a-4165-8a79-4e416fb9ec49', 'saadadil2264326@gmail.com', '$2b$12$5MFp0jrazF9GbbG631139OOgcgo64BVDqGOCPKCVsWEnKvVl77Zle', 'USER', '2026-03-14 15:06:29.869', '2026-03-14 15:06:29.869');
INSERT INTO public."User" VALUES ('a46f09fa-42aa-4a91-9076-9abd40044685', '123@gmail.com', '$2b$12$ZMqghskzZlbxislaICehPuDFLpDhORZ0oukQE3K47FEi1xpxEqJSS', 'ADMIN', '2026-03-14 15:27:32.388', '2026-03-14 15:27:32.388');
INSERT INTO public."User" VALUES ('e604f0d3-3fc3-4a16-9214-419b16520e10', 'admin@gmail.com', '$2b$12$JMed9eqOJYxLruLr5Mnt0ebPSZAAA3XW4VTFqNw2H3Z9QeXmFPj2O', 'ADMIN', '2026-03-14 20:38:51.685', '2026-03-14 20:38:51.685');
INSERT INTO public."User" VALUES ('70e05f37-92d7-466a-a2ee-8e15b24d9f61', 'user@gmail.com', '$2b$12$HgwDx8iqZk27Wb4a0nqSWuUGz874040XHAlLxvB3E.75CM3Ywiimq', 'USER', '2026-03-15 05:25:35.586', '2026-03-15 05:25:35.586');
INSERT INTO public."User" VALUES ('8af8f18b-1fd3-4360-bc4e-a611c6a4aba3', 'user1@gmail.com', '$2b$12$/ZvJl20.4KzhsoGOfIEhsOnFdQAybvTnTGkDyDaxU3CTravFQjjju', 'USER', '2026-03-15 05:45:09.599', '2026-03-15 05:45:09.599');
INSERT INTO public."User" VALUES ('3ab979d7-6c59-4e24-8d97-0007f9b76f18', 'awais@gmail.com', '$2b$12$XlQ.HJL8zKxg3SzLsqyPhORD4lafA6qIEN21ZltBtQqevCysgGJK.', 'USER', '2026-03-15 14:59:53.934', '2026-03-15 14:59:53.934');
INSERT INTO public."User" VALUES ('6dc96a17-1002-49db-ab58-4bb59e7d149b', 'test_signup_fix_1773588539@example.com', '$2b$12$XHII1VobwolIBZXZHZtBJ.T4gpJnLtWN2Bk5ZkcGTUCt10irKCqri', 'USER', '2026-03-15 15:28:59.631', '2026-03-15 15:28:59.631');
INSERT INTO public."User" VALUES ('317620ed-375a-4454-bc37-7cd0bee0fa21', 'user2@gmail.com', '$2b$12$ZPz6R9dSLu3NrRrpCtdvJO39KPB3BO2SaDVV1o0Qw8pRb4L.cbVwu', 'USER', '2026-03-15 15:30:00.976', '2026-03-15 15:30:00.976');
INSERT INTO public."User" VALUES ('ebbbdc36-54d7-47db-b978-a9d55c9a51ca', 'user4@gmail.com', '$2b$12$73QQWMN2DkM7XNomsl2naOEkhVnxoLZPcqXRW7NASEdWO4tmjmY1e', 'USER', '2026-03-15 17:07:49.125', '2026-03-15 17:07:49.125');
INSERT INTO public."User" VALUES ('ffb8bb49-bfd1-4912-b13b-9796693245ef', 'user3@gmai.com', '$2b$12$S4vy8yS/L.Tr/Mol/s3/leGkp5UoucLP.FgkX2MHHVxaSA6xm3HXq', 'USER', '2026-03-15 17:10:57.589', '2026-03-15 17:10:57.589');
INSERT INTO public."User" VALUES ('e0446430-ac32-45b9-a5e8-1b24a4ae05c2', 'arish@gmail.com', '$2b$12$YZcH7GcV7WoDphnb6Z7cl.SlJRsxXLSAi27c.H8z2AxDj0i5k..sO', 'USER', '2026-03-16 07:35:24.934', '2026-03-16 07:35:24.934');
INSERT INTO public."User" VALUES ('eb3c8f82-6ead-4b0c-92f9-e04f62654f5f', 'smb@gmail.com', '$2b$12$Auy0R8F512AP29w5DdhqFeiIttduTfMRqpRLTvEiMHNSIhyf9ozFW', 'USER', '2026-03-16 07:39:25.569', '2026-03-16 07:39:25.569');
INSERT INTO public."User" VALUES ('4e4e6af9-0eb2-4d4a-be4a-9c2405f00c1b', 'nuser@gmail.com', '$2b$12$/0NFuHSECxEXlU9fGbiEyuA33iizI8ss478Sdb26Dx7vb1seFiG0.', 'USER', '2026-03-16 08:25:08.377', '2026-03-16 08:25:08.377');
INSERT INTO public."User" VALUES ('9498c8bd-8257-4a61-a3a6-68fe1e11ef76', 'wuser@gmail.com', '$2b$12$1zECdRgCDIbWRFlfTp0IoOo3UGQsIlRp3wx3XiPTfBmWPI.l6oa/e', 'USER', '2026-03-16 08:27:52.624', '2026-03-16 08:27:52.624');


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public._prisma_migrations VALUES ('41a55910-f0ab-426b-be8d-a5e23c00f145', '1ae893652661b50d3c4b9f17360fc0a7bf82f93de1f6ac0e4d32d0cfc588ad5e', '2026-03-14 16:57:31.106357+05', '20260314115731_init', NULL, NULL, '2026-03-14 16:57:31.087301+05', 1);
INSERT INTO public._prisma_migrations VALUES ('9cf7d646-7481-46c7-9238-c58a8db94971', 'e14dd0a810fd2c12aa58e9df0b4b57150bcd63be2900b2404297d928351cfacf', '2026-03-14 18:04:31.414789+05', '20260314143000_document_hash_index', NULL, NULL, '2026-03-14 18:04:31.38965+05', 1);


--
-- Name: Document Document_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Document_fileHash_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Document_fileHash_idx" ON public."Document" USING btree ("fileHash");


--
-- Name: Document_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Document_userId_idx" ON public."Document" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Document Document_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict dVzLdaFrkBGYoijfR9R6CdCr7LXdQ4I6GsZeJehiI8ox45YH0Z46ZmOZIbzkHGL

