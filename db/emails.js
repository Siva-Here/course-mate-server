const ids =['N210155', 'N200351', 'N190751', 'N210383', 'N201002', 'N190002', 'N210011', 'N191088', 'N190369', 'N210024', 'N200891', 'N190274', 'N210123', 'N200723', 'N191087', 'N210104', 'N200077', 'N190962', 'N210794', 'N200588', 'N190830', 'N210477', 'N200871', 'N190455', 'N210346', 'N200545', 'N190736', 'N210894', 'N201100', 'N190399', 'N210762', 'N200096', 'N190973', 'N210627', 'N200305', 'N190348', 'N210403', 'N201076', 'N190347', 'N210675', 'N200247', 'N190401', 'N210746', 'N200053', 'N190741', 'N210626', 'N201108', 'N190755', 'N210806', 'N200016', 'N190878', 'N210973', 'N200145', 'N190421', 'N210969', 'N201001', 'N190168', 'N210867', 'N201051', 'N190145', 'N210082', 'N200388', 'N190486', 'N210680', 'N200518', 'N190950', 'N210769', 'N200738', 'N191027', 'N210709', 'N200414', 'N190468', 'N210376', 'N200329', 'N190949', 'N210958', 'N200878', 'N190243', 'N210097', 'N200161', 'N190727', 'N210966', 'N200750', 'N190081', 'N210151', 'N200368', 'N190227', 'N210547', 'N200334', 'N190473', 'N210566', 'N200004', 'N190628', 'N210700', 'N200072', 'N190442', 'N211062', 'N200394', 'N190113', 'N211094', 'N200106', 'N190739', 'N210798', 'N200186', 'N190500', 'N210141', 'N190994', 'N190797', 'N210124', 'N190885', 'N210257', 'N201023', 'N190587', 'N210054', 'N201054', 'N191008', 'N210072', 'N200561', 'N190579', 'N210494', 'N200478', 'N190926', 'N210442', 'N200784', 'N190450', 'N210380', 'N200427', 'N190212', 'N211013', 'N200168', 'N191029', 'N210191', 'N200107', 'N190539', 'N210413', 'N200677', 'N190035', 'N210307', 'N200899', 'N190877', 'N210983', 'N200808', 'N190431', 'N210352', 'N200666', 'N190627', 'N210893', 'N200166', 'N190718', 'N210934', 'N200426', 'N190410', 'N210115', 'N200074', 'N190186', 'N210078', 'N200509', 'N190022', 'N210228', 'N200584', 'N190681', 'N211061', 'N200148', 'N190889', 'N200240', 'N200084', 'N190038', 'N210711', 'N200232', 'N190772', 'N210642', 'N200546', 'N190934', 'N210971', 'N200447', 'N190563', 'N211090', 'N200307', 'N190245', 'N210053', 'N200944', 'N190432', 'N210605', 'N200572', 'N190620', 'N210877', 'N201006', 'N190448', 'N210006', 'N201014', 'N190014', 'N210052', 'N200781', 'N190937', 'N210862', 'N200154', 'N190918', 'N210974', 'N200054', 'N190341', 'N210016', 'N200853', 'N190163', 'N210548', 'N200517', 'N190397', 'N210239', 'N200176', 'N190260', 'N210944', 'N200037', 'N191035', 'N210369', 'N200947', 'N191102', 'N210040', 'N200695', 'N190253', 'N210288', 'N200496', 'N190729', 'N210056', 'N200713', 'N190685', 'N210633', 'N200238', 'N190226', 'N210736', 'N200620', 'N190837', 'N210272', 'N200095', 'N190670', 'N210995', 'N200948', 'N190700', 'N210559', 'N200652', 'N190497', 'N210487', 'N200254', 'N190832', 'N211057', 'N200283', 'N190336', 'N210204', 'N200542', 'N190929', 'N210246', 'N200957', 'N190851', 'N211086', 'N201075', 'N190027', 'N210089', 'N201050', 'N190472', 'N210726', 'N200680', 'N190686', 'N210463', 'N200812', 'N190285', 'N210398', 'N200770', 'N190265', 'N210161', 'N200745', 'N190107', 'N210527', 'N200377', 'N190669', 'N210539', 'N200069', 'N190660', 'N210841', 'N200381', 'N190641', 'N210163', 'N200910', 'N190531', 'N210545', 'N201045', 'N190083', 'N210436', 'N200883', 'N190930', 'N210967', 'N200350', 'N190963', 'N210801', 'N200917', 'N190062', 'N210086', 'N200207', 'N190783', 'N190993', 'N201130', 'N191122', 'N210046', 'N201056', 'N190989', 'N210354', 'N200134', 'N190858', 'N210409', 'N200539', 'N190969', 'N211101', 'N200813', 'N190142', 'N211024', 'N200829', 'N190495', 'N210624', 'N200491', 'N190894', 'N210039', 'N201070', 'N190910', 'N210175', 'N200712', 'N190375', 'N210396', 'N200251', 'N190714', 'N210412', 'N200009', 'N190971', 'N210993', 'N200689', 'N190684', 'N210414', 'N200034', 'N190522', 'N210081', 'N200841', 'N190039', 'N210299', 'N200575', 'N190662', 'N210685', 'N200466', 'N190766', 'N210948', 'N201116', 'N190052', 'N210454', 'N200162', 'N190314', 'N210671', 'N201064', 'N190477', 'N210143', 'N200392', 'N210026', 'N200042', 'N210216', 'N200814', 'N210050', 'N200594', 'N210255', 'N210954', 'N211077', 'N210184', 'N210214', 'N210481', 'N210264', 'N210247', 'N210634', 'N210838', 'N211055', 'N210132', 'N210483', 'N210036', 'N210684', 'N210261', 'N210303', 'N210137', 'N211089', 'N210294', 'N210366', 'N210265', 'N210171', 'N210142', 'N210047', 'N210584', 'N210068', 'N211004', 'N210301', 'N210274', 'N210577', 'N210639', 'N211106', 'N210153', 'N210236', 'N210128', 'N210157', 'N211029', 'N210342', 'N210775', 'N210042', 'N210219', 'N210505', 'N210665', 'N210964', 'N210686', 'N210968', 'N210051', 'N210223', 'N211023', 'N210324', 'N210158', 'N210217', 'N210836', 'N210406', 'N211080', 'N210750', 'N190507', 'N210962', 'N190928', 'N210781', 'N190461', 'N210826', 'N190310', 'N210335', 'N200706', 'N190847', 'N210048', 'N200675', 'N190263', 'N210499', 'N200525', 'N190380', 'N210030', 'N200799', 'N190740', 'N210872', 'N200629', 'N190017', 'N210860', 'N200991', 'N190567', 'N210710', 'N200373', 'N190813', 'N211031', 'N200870', 'N191126', 'N210929', 'N200129', 'N190172', 'N210580', 'N200365', 'N190065', 'N210899', 'N200943', 'N191032', 'N210209', 'N200156', 'N190205', 'N210843', 'N201058', 'N190771', 'N210782', 'N200714', 'N190722', 'N210660', 'N200401', 'N190396', 'N210553', 'N200647', 'N190257', 'N210432', 'N200094', 'N190696', 'N210166', 'N200398', 'N190511', 'N210696', 'N200676', 'N190315', 'N210438', 'N201057', 'N190986', 'N210450', 'N200190', 'N190957', 'N210789', 'N200578', 'N190667', 'N210118', 'N200246', 'N190114', 'N210100', 'N200006', 'N190657', 'N210226', 'N200573', 'N190291', 'N211016', 'N200180', 'N190974', 'N210529', 'N200635', 'N190951', 'N210937', 'N201007', 'N190434', 'N210037', 'N200634', 'N190183', 'N210714', 'N200296', 'N190019', 'N210025', 'N200596', 'N190394', 'N210721', 'N200854', 'N191068', 'N210013', 'N200101', 'N190057', 'N210407', 'N200997', 'N190713', 'N210799', 'N200216', 'N190400', 'N210765', 'N200029', 'N190939', 'N210770', 'N200224', 'N190487', 'N211087', 'N200291', 'N191034', 'N210041', 'N201126', 'N190130', 'N210764', 'N200050', 'N190392', 'N210610', 'N200833', 'N190981', 'N210368', 'N200348', 'N190676', 'N210597', 'N200124', 'N190982', 'N210422', 'N200749', 'N191130', 'N210701', 'N200851', 'N190710', 'N210109', 'N200734', 'N190883', 'N210133', 'N200153', 'N190201', 'N210956', 'N200352', 'N190566', 'N210234', 'N200786', 'N191044', 'N210043', 'N200017', 'N190192', 'N210172', 'N200950', 'N191106', 'N210904', 'N200731', 'N190581', 'N210540', 'N200732', 'N190558', 'N210136', 'N200890', 'N190197', 'N210419', 'N200220', 'N190050', 'N211010', 'N200065', 'N190231', 'N210187', 'N200621', 'N190484', 'N210809', 'N200524', 'N191025', 'N211000', 'N201078', 'N190367', 'N210176', 'N200052', 'N190452', 'N211053', 'N200372', 'N190796', 'N210059', 'N200460', 'N190318', 'N210902', 'N200694', 'N190382', 'N210479', 'N200807', 'N190876', 'N210435', 'N200622', 'N190658', 'N210930', 'N200150', 'N191111', 'N210049', 'N200093', 'N190190', 'N210600', 'N200226', 'N190491', 'N210327', 'N200289', 'N190191', 'N210338', 'N200395', 'N190085', 'N211056', 'N200817', 'N190470', 'N210730', 'N200051', 'N190251', 'N211006', 'N200908', 'N190645', 'N210197', 'N200988', 'N190327', 'N210256', 'N200304', 'N190927', 'N210399', 'N200788', 'N190157', 'N210242', 'N200340', 'N190504', 'N210888', 'N200686', 'N190249', 'N210901', 'N200683', 'N190016', 'N210760', 'N200773', 'N190106', 'N210803', 'N200036', 'N190370', 'N210984', 'N200197', 'N190651', 'N210520', 'N200649', 'N190134', 'N210381', 'N200005', 'N190426', 'N210742', 'N201028', 'N190882', 'N210574', 'N200705', 'N191004', 'N210385', 'N200014', 'N190144', 'N210210', 'N200827', 'N190166', 'N210302', 'N200461', 'N190105', 'N210023', 'N200147', 'N190111', 'N210017', 'N200374', 'N190222', 'N210594', 'N200663', 'N190377', 'N210459', 'N200556', 'N190914', 'N210292', 'N200317', 'N190456', 'N211092', 'N200040', 'N190650', 'N210221', 'N200894', 'N190861', 'N210492', 'N200529', 'N190515', 'N210727', 'N200541', 'N190422', 'N210965', 'N200982', 'N190031', 'N210735', 'N200450', 'N190368', 'N210519', 'N200128', 'N190286', 'N210278', 'N200904', 'N190897', 'N210379', 'N200809', 'N190716', 'N210655', 'N200472', 'N190488', 'N210001', 'N200671', 'N190612', 'N210002', 'N200338', 'N190496', 'N210281', 'N200085', 'N190728', 'N210249', 'N200682', 'N190925', 'N210353', 'N200704', 'N191065', 'N210243', 'N200522', 'N190757', 'N210866', 'N200187', 'N190188', 'N210496', 'N200170', 'N190311', 'N211069', 'N200645', 'N191048', 'N210284', 'N200048', 'N190829', 'N210570', 'N200357', 'N190118', 'N210486', 'N200551', 'N190293', 'N210813', 'N200934', 'N190983', 'N210912', 'N200171', 'N190742', 'N210103', 'N200375', 'N190309', 'N210101', 'N200592', 'N190649', 'N210678', 'N200137', 'N190679', 'N210522', 'N201087', 'N190561', 'N210088', 'N200698', 'N191052', 'N210845', 'N200626', 'N191073', 'N210095', 'N200886', 'N190373', 'N210615', 'N200364', 'N191114', 'N210340', 'N200208', 'N190748', 'N210401', 'N200570', 'N191062', 'N210279', 'N200935', 'N190406', 'N210495', 'N200378', 'N190457', 'N210471', 'N201102', 'N190239', 'N210507', 'N200118', 'N190958', 'N210188', 'N200177', 'N191031', 'N210599', 'N200514', 'N190787', 'N210235', 'N200571', 'N190898', 'N210102', 'N200996', 'N190793', 'N210774', 'N200323', 'N190865', 'N210162', 'N200500', 'N190480', 'N210821', 'N200532', 'N190011', 'N210296', 'N200059', 'N190489', 'N210173', 'N200863', 'N190893', 'N210988', 'N200585', 'N191113', 'N210778', 'N200801', 'N190096', 'N210673', 'N200619', 'N190810', 'N210212', 'N200157', 'N190818', 'N210797', 'N190995', 'N190110', 'N210038', 'N200589', 'N191079', 'N210145', 'N200804', 'N190943', 'N210312', 'N200459', 'N190112', 'N210300', 'N200911', 'N190284', 'N210085', 'N200151', 'N190838', 'N210835', 'N200800', 'N191042', 'N210237', 'N200219', 'N190493', 'N210920', 'N200503', 'N190419', 'N210565', 'N200279', 'N190075', 'N210258', 'N200715', 'N190234', 'N210999', 'N200194', 'N190127', 'N210950', 'N200587', 'N190272', 'N210759', 'N200486', 'N191028', 'N210215', 'N200071', 'N190577', 'N201096', 'N200119', 'N190437', 'N210455', 'N200515', 'N191056', 'N211026', 'N200366', 'N190300', 'N210384', 'N200081', 'N190970', 'N210111', 'N200346', 'N190849', 'N210390', 'N200143', 'N190270', 'N210598', 'N200169', 'N191061', 'N210753', 'N200519', 'N190058', 'N210940', 'N200102', 'N190482', 'N210621', 'N200295', 'N190378', 'N210323', 'N200861', 'N191069', 'N210699', 'N200741', 'N191084', 'N210921', 'N200103', 'N190391', 'N210972', 'N200963', 'N190108', 'N210837', 'N200133', 'N210193', 'N200794', 'N210125', 'N200109', 'N210333', 'N200339', 'N210416', 'N200438', 'N210942', 'N200893', 'N210780', 'N200141', 'N200212','N200086', 'vasuch9959','N200430']

const emails = ids.map(id => id.replace('N', 'n') + '@rguktn.ac.in');
module.exports = emails;