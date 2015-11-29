var async = require("async");
var fs = require('fs');
var _ = require('lodash');
var json2csv = require('json2csv');
var _ = require('lodash');

var allData ="RAD-ISO-ISO-CAN-CAN-CAN-RAD-LAB-CAN-CAN-CAN-LAB-LAB-CAN-URL-LAB-CAN-CAN-CAN-LAB-CAN-CAN-LAB-LAB-CAN-CAN-CAN-LAB-CAN-LAB-MEI-CAN-LAB-CAN-URL-CAN-LAB-CAN-LAB-ISO-ISO-CAN-LAB-CAN-CAN-LAB-CAN-CAN-LAB-URL-CAN-CAN-CAN-LAB-CAN-CAN-LAB-RAD-LAB-CAN-RAD-LAB-CAN-CAN-CAN-LAB-CAN-CAN-LAB-CAN-CAN-CAN-ALA-LAB-PNE-ISO-ISO-LAB-CAN-CAN-CAN-ISO-LAB-CAN-RAD-ALA-CAN-LAB-NER-LAB-CAN-CAN-NER-CAN-NER-LAB-RAD-ANE-OPE,LAB-MEI-LAB-MEI-LAB-MEI-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-COR-OPE,RAD-RAD-RAD-RAD-OPE-OPE-RAD-RAD-RAD-RAD-DIS-DIS-RAD-RAD-ORP-ORP-RAD-RAD-ORP-ORP-OTB-OTB-DIB-DIB-ORP-ORP-RAD-RAD-ORP-ORP-RAD-RAD-ORP-ORP-RAD-RAD-ORP-ORP-ARB-ARB-RAB-RAB-OTB-OTB-OTB-OTB-DIB-DIB-RAD-RAD-BCB-BCB-OPE-OPE-RAD-RAD-COR-COR-COR-COR-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-ENT-ENT-RAD-RAD-ENT-ENT-ENT-ENT-OPE-OPE-RAD-RAD-OPE-OPE,MEI-MEI-OPH-OPH-LAB-LAB-MEI-MEI-LAB-LAB-MEI-MEI-RAD-RAD-LAB-LAB-MEI-MEI-RAD-RAD-RAD-RAD-OPE-OPE-RAD-OPE,COR-LAB-COR-COR-COR-COR-COR-COR-COR-COR-RAD-RAD-RAD-RAD-RAD-RAD-OPE-OPE-RAD-RAD-RAD-RAD-OPE-OPE-RAD-RAD-RAD-RAD-RAD-RAD-OPE-OPE-RAD-RAD-OPE,LAB-STO-STO-LAB-ANE-ADM-OPE-RAD-STO-STO-STO-OPH-STO-GNE-STO-STO-STO-CHR-ENT-ENT-LAB-MEI-MEI-PSI-MEI-CHR-MEI-RAD-LAB-ANE-ADM-OPE,OPH-MEI-LAB-MEI-MEI-MEI-DOP-ART-LAB-RAD-MEI-COR-ANE-OPE-ART-OPH-COR-COR-ENT-ENT-RAD-OPE-OPE-OPE-LAB-LAB-LAB-LAB-LAB-RAD-LAB-OPE,PNE-RAD-COR-LAB-RAD-RAD-COR-COR-COR-ORL-COR-COR-DER-COR-NER-OPH-PRT-ENT-ENT-ENT-RAD-RAD-RAD-OPE-ENT-RAD-COR-ENT-LAB-CAN-RAD-OPE,MEI-PSI-MEI-PSI-CHB-ENT-ENT-ENT-ENT-CHB-LAB-ANE-ADM-RAD-OPE,PED-LAB-ANE-ADM-OPE,RAD-CHB-COR-COR-RAD-COR-COR-LAB-ANE-OPE,PED-LAB-ANE-OPE,URL-LAB-ANE-OPE,OPH-ANE-OPE,OPH-ANE-OPE,ART-LAB-RAD-DOP-ADM-ANE-OPE-OPE,RAD-RAB-ENB-ANE-ANE-ENT-OPE-OPE,OPH-CHR-OPE-OPH-OPH-OPE,ART-LAB-RAD-ANE-PNE-PNE-OPE,RAD-ENT-ENT-ISO-ISO-RAD-RAD-PNE-PNE-RAD-RAD-RAD-OPE,RAD-RAD-ORP-LAB-ANE-OPE,RAD-ORP-RAD-LAB-ANE-OPE,ORP-RAD-RAD-ORP-ORP-ANE-OPE,RAD-LAB-ORP-ANE-RAD-OPE,DEB-DEB-BCB-STO-BCB-DEB-BCB-ANE-ADM-OPE,BST-BST-BST-OLB-RAD-OLB-OPH-OPB-BST-BST-BST-ANE-ADM-OPE,LAB-PRB-PRT-PRT-LAB-CHR-CHR-OPH-CHR-RAD-ART-LAB-ANE-ADM-OPE,STO-RAD-ORP-ORP-LAB-ANE-ADM-OPE,LAB-URL-LAB-URL-CHR-LAB-RAD-ANE-ADM-OPE,RAD-SNO-ENT-LAB-RAD-RAD-ANE-ADM-OPE,GNE-GNE-ORL-RAD-ORL-LAB-LAB-ANE-ORL-ADM-OPE,LAB-MEI-LAB-MEI-LAB-MEI-LAB-MEI-CHR-LAB-ANE-OPE,STO-STO-RAD-ORP-STO-RAD-RAD-DIS-DIS-STO-ORL-LAB-ANE-OPE,RAD-ORP-ORP-PED-PED-LAB-ANE-OPE,STO-RAD-STO-NER-STO-RAD-STO-NER-NER-NEB-NER-RAD-RAD-NER-RAD-LAB-ANE-OPE,OPH-URL-RAD-PRT-PRT-PRT-RAD-LAB-ANE-OPE,ORP-RAD-RAD-URL-RAD-ART-ART-RAD-DOP-ART-RAD-ORP-RAD-ORP-STO-RAD-RAD-STO-LAB-ANE-OPE,DIS-ORP-RAD-ORP-RAD-ORP-RAD-ORP-RAD-ORP-RAD-ORP-LAB-ANE-OPE-DIS-RAD-ORP-STO-RAD-STO-LAB-ANE-OPE,ORP-ORP-ORP-RAD-ORP-RAD-LAB-DIS-ORP-ANE-OPE,NEB-RAB-GNB-RAB-OTB-ISO-ISO-OTB-ARB-ART-LAB-RAD-ANE-OPE,RAD-GNB-RAD-ISO-ISO-BCB-RAD-RAD-CHR-LAB-RAD-ANE-OPE,OPH-ANE-ADM-OPE-OPH-OPH-OPE-OPH-OPH-GNE-DYN-LAB-RAD-ANE-OPE,CAN-ENT-LAB-RAD-ANE-OPE,STO-STO-STO-ENT-STO-STO-ENT-BST-BST-RAD-RAD-LAB-ANE-OPE-ENT-OPE,OTB-LAB-RAD-OPE-ANE-OPE-DIB-DIB-DIB-DIB-DIB-OTB-OTB-COB-OTB-LAB-ANE-ANE-GNB-OPE,PED-PED-PED-RAD-LAB-PED-ANE-PED-LAB-OPE,RAD-PED-PED-OPH-PED-OPH-OPH-LAB-OPH-OPH-ANE-OPE-OPE,COR-COR-LAB-ISO-ISO-COR-RAD-PNE-OPH-LAB-COB-NER-NER-NER-OPH-OPE,STO-RAD-ORP-RAD-ORP-LAB-OPE-RAD-ORP-RAD-RAD-ORP-RAD-ORP-OPE,RAD-RAD-RAD-PHY-PHY-RAD-RAD-RAD-PED-PED-RAD-PED-PED-LAB-LAB-PED-RAD-LAB-LAB-PED-OPE,COR-COR-COR-COR-PNE-PNE-RAD-ORL-RAD-ORL-COR-RAD-LAB-ANE-ORL-PNE-PNE-OPE,PSI-PSI-RAD-COR-COR-PSI-RAD-ORP-ORP-OPE-RAD-ORP-ORP-OPE-RAD-OPE-ORP-OPE-RAD-PSI-OPE,RAD-ORP-RAD-ORP-ORP-ORP-RAD-RAD-ORP-ANE-ENT-ENT-RAD-OPE,STO-STO-STO-ORP-DIS-ORP-STO-ORP-STO-RAD-ORP-LAB-ANE-OPE-RAD-OPE,ORL-RAD-ORL-RAD-RAD-ORL-ORL-RAD-RAD-ISO-ISO-ENT-RAD-COR-COR-RAD-RAD-RAD-COR-RAD-COR-RAD-ISO-COR-COR-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-OPE,STO-STO-RAD-DOL-STO-OPE-OPE-STO-OPE,ORL-ORL-ORL-ORL-ORL-ANE-ADM-OPE,OPH-OPH-ANE-ADM-OPE-OPH-OPH-ADM-OPE,ORP-ORP-RAD-ORP-LAB-ANE-OPE,RAD-ORP-RAD-ORP-RAD-RAD-ORP-LAB-ANE-OPE,URL-URL-LAB-URL-RAD-LAB-ANE-OPE,RAD-OPE-RAD-RAD-RAD-RAD-RAD-OPE-RAD-ISO-RAD-ORP-ADM-RAD-ORP-ART-RAD-ARB-RAD-ARB-OPE,CPN-LAB-CPN-LAB-OBS-LAB-CPN-CPN-LAB-CPN-LAB-OBS-OBS-CPN-CPN-LAB-CPN-LAB-OBS-CPN-LAB-CPN-CPN-LAB-CPN-LAB-CPN-LAB-OPE,NER-DOL-DOL-DOL-NER-RAB-OPE-RAB-OPE-OPE-NER-OPE,PED-ORL-ORL-ORL-ORL-ORL-ORL-ORL-ORL-LAB-ANE-ORL-OPE,ORP-RAD-RAD-RAD-ORP-LAB-ANE-OPE-DIS-ORP-ORP-ORP-ORP-ORP-RAD-ORP-LAB-ANE-RAD-OPE,RAD-PNE-PNE-PNE-PNE-RAD-RAD-RAD-ISO-ISO-RAD-CAN-RAD-CAN-LAB-CAN-ADM-LAB-CHR-CAN-ORP-CAN-LAB-CAN-LAB-RAD-RAD-OPE,LAB-LAB-LAB-LAB-LAB-LAB-LAB-CPN-LAB-OBS-OBS-CPN-LAB-OBS-CPN-LAB-OBS-CPN-LAB-OBS-CPN-LAB-LAB-CPN-OBS-OBS-LAB-OPE,DIS-ORP-RAD-ISO-ISO-ORP-OPH-ORP-LAB-CHR-ART-ORP-ADM-OPE-CHR-LAB-ANE-OPE,ORL-ORL-ORL-ORP-ISO-ORP-RAD-ORP-RAD-LAB-ANE-OPE,OPH-OPH-RAD-GNE-RAD-SNO-MEI-OPH-OPH-RAD-MEI-LAB-SNO-RAD-RAD-SNO-RAD-SNO-RAD-LAB-GNE-ANE-ADM-ISO-OPE,CHR-LAB-RAD-ANE-ADM-OPE-CHR-CHR-RAD-CHR-URL-LAB-ANE-OPE-RAD-URL-OPE-URL-RAD-ADM-ADM-OPE-OPE-RAD-URL-ADM-OPE-RAD-URL-OPE,ORP-LAB-ANE-ADM-OPE,GNB-STO-STO-LAB-ANE-ADM-OPE,URL-LAB-ANE-ADM-OPE,OPH-ANE-ADM-OPE,GNE-STO-ANE-ADM-OPE,RAD-URL-COR-RAD-URL-RAD-RAD-URL-COR-COR-COR-COR-COR-COR-ADM-OPE,PRT-ENB-ENB-COB-RAB-BCB-RAB-BCB-ANE-OPE,CHR-LAB-ANE-OPE,CHB-CHR-LAB-ANE-OPE,ORL-RAD-NEB-LAB-ANE-OPE,STO-OPE-LAB-ANE-OPE,RAD-ORP-ORP-COR-COR-COR-COR-COR-ORP-ORP-LAB-ANE-OPE,PED-LAB-ANE-OPE,RAD-GNE-OPE-GNE-GNE-LAB-PRT-LAB-ANE-OPE,COR-COR-COR-COR-CHR-RAD-LAB-ANE-OPE,STO-LAB-ANE-OPE,STO-LAB-ANE-OPE,STO-LAB-ANE-OPE,STO-LAB-ANE-OPE,STO-RAD-STO-LAB-ANE-OPE,STO-RAD-STO-LAB-ANE-OPE,STO-STO-LAB-ANE-OPE,OPH-ORP-ORP-ANE-OPE,RAD-RAD-ORP-OPE-DOL-OPE,LAB-LAB-RAD-DER-RAD-RAD-LAB-DER-RAD-RAD-COR-COR-COR-RAD-ANE-LAB-OPE,STO-STO-LAB-ANE-OPE-OPE,RAD-ISO-ISO-ISO-RAD-PNE-PNE-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-ENT-ENT-RAD-RAD-ISO-RAD-RAD-ISO-ISO-RAD-OPE,RAD-RAD-ENT-RAD-RAD-RAD-RAD-RAD-ISO-RAD-RAD-STO-RAD-RAD-RAD-RAD-RAD-ISO-ISO-RAD-RAD-RAD-LAB-RAD-ENT-RAD-RAD-ENT-ENT-ADM-RAD-RAD-OPE,ORL-RAD-NER-ORL-RAD-NER-RAD-RAD-ORL-RAD-RAD-RAD-RAD-RAD-OPE-RAD-RAD-RAD-OPE-RAD-RAD-OPE-ENT-RAD-RAD-RAD-OPE-RAD-RAD-ENT-OPE-OPE-RAD-RAD-RAD-OPE,COR-COR-ADM-OPE-OPE-OPE-RAD-URL-RAD-OPE,LAB-ANE-ADM-OPE,ORP-ADM-OPE,RAD-RAD-ORP-RAD-ORP-LAB-OPE-RAD-RAD-ORP-RAD-ORP-ADM-OPE,LAB-ANE-OPE,LAB-ANE-OPE,LAB-ANE-OPE,LAB-ANE-OPE,LAB-ANE-OPE,LAB-ANE-OPE,LAB-ANE-OPE,LAB-ANE-OPE,LAB-ANE-OPE,DIS-DIS-LAB-ANE-OPE,RAD-LAB-ANE-OPE,RAB-RAB-RAD-RAD-BCB-COB-RAB-ANE-OPE,LAB-RAD-RAD-LAB-RAD-LAB-RAD-ANE-OPE,RAD-RAD-ANE-OPE,RAD-ISO-ISO-ISO-RAD-PNE-RAD-PNE-PNE-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-PNE-RAD-RAD-RAD-RAD-RAD-PNE-RAD-RAD-PNE-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-OPE-OPE,RAD-LAB-ORP-OPE,ORL-RAD-OPE,STO-RAD-OPE,BCB-GNB-LAB-URL-RAB-CHR-ENT-ENT-DIB-MEI-DIB-RAD-DIB-DIB-LAB-MEI-MEI-LAB-MEI-CHR-RAD-LAB-CHR-ANE-ADM-OPE,LAB-NER-LAB-LAB-RAD-RAD-OPE-RAD-LAB-NER-RAD-RAD-ORP-STO-GNE-RAD-ORP-ORP-LAB-OPH-NER-LAB-LAB-NER-ISO-LAB-RAD-ORP-STO-LAB-NER-RAD-ORP-LAB-RAD-LAB-ANE-ADM-OPE,ISO-ISO-NER-ORL-NER-ORL-NER-ORL-RAD-RAD-NER-OPH-ORL-OPH-ANE-ADM-OPE,URL-COR-COR-NER-NER-NER-NER-LAB-URL-NER-LAB-RAD-ANE-OPE-COR-URL-URL-NER-RAD-RAD-RAD-URL-OPH-ANE-ADM-OPE,CHR-RAD-ENT-ENT-MEI-CHR-RAD-MEI-ANE-LAB-ADM-OPE,NER-MEI-MEI-MEI-MEI-MEI-LAB-MEI-LAB-OPH-MEI-OPH-OPH-MEI-ANE-ISO-ISO-OPE-OPH-ISO-ISO-OPH-ADM-OPE,ENB-PSI-MEI-ENB-LAB-LAB-ANE-MEI-ENT-OPE-MEI-ENT-LAB-MEI-ENT-MEI-ENT-MEI-LAB-ANE-OPE,GNE-GNE-LAB-CAN-URL-RAD-CAN-RAD-URL-GNE-ENT-GNE-GNE-ENT-RAD-LAB-ANE-OPE,ENT-LAB-URL-ENT-NER-RAD-RAD-NER-NER-ORP-ENT-ENT-ORL-ENT-RAD-LAB-ANE-OPE,ANE-LAB-ENT-ENT-ENT-ENT-ENT-STO-ENT-STO-GNE-STO-RAD-LAB-PSI-ANE-OPE,OPH-RAD-ORL-PED-PED-OPE-PED-PED-RAD-PED-STO-RAD-LAB-RHU-ANE-OPE,ARB-MEI-NER-MEI-RAD-RAD-RAD-OPE-ENT-ENT-COR-COR-ART-RAD-ART-RAD-MEI-ART-RAD-ART-RAD-OPE-OPE-ART-ORP-ART-MEI-OPE,ORP-RAD-ORP-RAD-ORP-LAB-RHU-ISO-ISO-NER-RAD-NER-RHU-PSI-NER-ENT-NER-GNE-ENT-LAB-ANE-ADM-ENT-OPE-OPE,MEI-LAB-MEI-ORL-OPH-ISO-COR-COR-OPH-ISO-ISO-RAD-PNE-PNE-RAD-OPH-PNE-PNE-PNE-ORL-PNE-ORL-LAB-COR-ANE-ORL-OPE,MEI-MEI-MEI-LAB-MEI-RAD-RAD-OPE-MEI-RAD-RAD-DIS-RAD-RAD-RAD-RAD-RAD-RAD-ORP-NER-RAD-ORP-MEI-NER-MEI-MEI-ISO-RAD-RAD-ORP-RAD-ISO-ISO-RAD-RAD-RAD-RAD-RAD-RAD-RAD-ISO-ISO-RAD-MEI-ART-COR-ART-LAB-MEI-LAB-RAD-ANE-RAD-RAD-OPE,OPH-LAB-MEI-LAB-MEI-ADM-ISO-ISO-ISO-MEI-ISO-MEI-OPH-MEI-MEI-OPH-MEI-OPH-MEI-MEI-MEI-MEI-OPH-LAB-MEI-MEI-LAB-MEI-DER-DER-LAB-MEI-ORL-MEI-LAB-MEI-RAD-RAD-RAD-OPE,DIS-ENT-ENT-BCB-CHR-GNB-LAB-LAB-CHR-GNE-GNE-ANE-OPE,ORP-RAD-RAD-STO-OPH-ORP-RAD-LAB-ISO-ANE-OPE,RAD-SNO-LAB-CHR-RAD-ENT-ENT-CHR-RAD-LAB-ANE-OPE,COR-LAB-COR-MEI-OPH-COR-OPH-ANE-OPE,DER-CHR-DER-CHB-BCB-COB-RAB-ANE-OPE,DER-RAD-OPH-ORL-RAD-RAD-ORL-OPH-ENB-LAB-RAD-ANE-OPE,OPE-CHR-GNE-RAD-RAD-GNE-ENT-URL-LAB-RAD-RAD-ANE-RAD-ENT-OPE-OPE,RAD-ORP-RAD-DYN-DOL-OPE-URL-SNO-URL-URL-RAD-URL-URL-OPE-URL-URL-URL-URL-RAD-RAD-ORP-OPE-OPE,MEI-OPH-LAB-MEI-COR-OPH-LAB-MEI-ORP-RAD-RAD-ORP-RHU-RAD-ORP-OPE,PNE-RAD-COR-COR-COR-LAB-MEI-LAB-MEI-OPH-LAB-MEI-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-OPE,RAD-RAD-ISO-RAD-GNE-ISO-ISO-RAD-RAD-RAD-RAD-ENT-ENT-ORL-OPE,LAB-CAN-PNE-DER-LAB-CAN-DER-COR-DER-ART-LAB-CAN-DOP-ART-DER-DER-OPH-LAB-CAN-COR-DER-RAD-RAD-OPH-ANE-DER-OPE-RAD-OPH-OPE-OPH-ANE-CAN-LAB-ADM-OPE,ENB-LAB-PSI-ANE-ENT-ENT-PSI-LAB-MEI-RAB-PSI-MEI-ENB-PSI-LAB-MEI-ENB-MEI-PSI-RAD-ORP-GNE-RAD-LAB-ORP-ENB-MEI-ENB-LAB-ANE-PSI-OPE-ENT-RAD-PSI-MEI-ENB-LAB-MEI-LAB-LAB-PSI-RAD-MEI-LAB-RAD-MEI-PSI-MEI-ENB-CHB-PNE-RAD-PNE-LAB-MEI-MEI-PNE-CHB-RAD-LAB-ISO-ANE-ENB-OPE,STO-RAD-ISO-ISO-ENT-ADM-OPE-RAD-RAD-PNE-PNE-RAD-RAD-ORL-ORL-RAD-OPE-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-ORL-ORL-CAN-LAB-CAN-ORL-CAN-RAD-LAB-CAN-LAB-CAN-ORL-ORL-ART-RAD-CAN-RAD-ENT-ENT-OPE-RAD-RAD-RAD-ORL-PNE-PNE-RAD-ORL-RAD-LAB-PNE-ORL-ORL-RAD-RAD-RAD-PNE-PNE-PNE-ENT-RAD-RAD-RAD-ENT-PNE-PNE-ORL-ISO-ISO-RAD-PNE-OPE-RAD-LAB-CAN-ORL-LAB-OPE,ORL-DER-PSI-DER-STO-LAB-DER-DER-STO-DER-ENT-ENT-MEI-DER-STO-MEI-DER-MEI-ORP-ORP-LAB-ORP-ANE-MEI-STO-ADM-OPE-DIS-DIS-DIS-ORP-DER-MEI-ORL-ORL-DER-RAD-OPH-ORL-MEI-LAB-ANE-ORL-OPE,DER-GNE-PSI-OPH-PSI-RAD-COR-PSI-PSI-COR-COR-ISO-LAB-ISO-ISO-PSI-COR-GNE-PSI-ADM-COR-PSI-GNE-PSI-ENT-PSI-RAD-ISO-DYN-LAB-ISO-URL-ISO-URL-RAD-RAD-RAD-NER-ENT-ENT-RAD-RAD-URL-COR-URL-URL-ENT-URL-URL-LAB-RAD-URL-URL-ENT-ENT-DYN-ART-URL-NER-PSI-URL-URL-URL-DOP-URL-ART-COR-ENT-NER-URL-CHR-RAD-LAB-RAD-URL-RAD-ANE-URL-PSI-OPE,OLB-ORL-ENT-ISO-ISO-ENT-PNE-PNE-RAD-RAD-RAD-RAD-RAD-ORL-CAN-STO-LAB-ANE-OPE-CAN-LAB-RAD-CAN-ENT-RAD-RAD-CAN-LAB-CAN-CAN-CAN-LAB-CAN-LAB-CAN-CAN-CAN-LAB-CAN-LAB-LAB-CAN-LAB-CAN-RAD-CAN-ORL-CAN-ORL-ORL-COB-BCB-RAB-LAB-CAN-CAN-ANE-ORL-OPE-ENT-ENT-RAD-RAD-RAD-ORL-ORL-RAD-ORL-ORL-LAB-CAN-ORL-ORL-ORL-RAD-RAD-RAD-LAB-LAB-CAN-RAD-ENT-OPE-RAD-ISO-ISO-RAD-ENT-ENT-CAN-OPE-ENT-RAD,CAN-CAN-CAN-LAB-LAB-CAN-CAN-LAB-CAN-CAN-CAN-CAN-CAN-LAB-RAD-CAN-CAN-CAN-LAB-CAN-CAN-CAN-LAB-CAN-CAN-LAB-CAN-CAN-CAN-LAB-CAN-LAB-CAN-CAN-CAN-CAN-LAB-LAB-RAD-RAD-ISO-ISO-CAN-CAN-CAN-CAN-CAN-CAN-CAN-CAN-RAD-LAB-RAD-CAN-CAN-CAN-CAN-CAN-CAN-CAN-NER-LAB-COR-COR-CAN-CAN-CAN-RAD-LAB-CAN-ANE-OPE,OPE,OPE-OPE,RAD-OPE,RAD-OPE,RAD-OPE,RAD-OPE,RAD-RAD-ISO-RAD-OPE,RAD-RAD-OPE,RAD-RAD-OPE,RAD-RAD-OPE,RAD-RAD-OPE,RAD-RAD-RAD-OPE,RAD-RAD-RAD-RAD-OPE,LAB-ANE-OPE-ANE-ADM-OPE,ART-DOP-ART-ART-ART-LAB-RAD-ANE-OPE,GNE-GNE-LAB-OPE,NEB-NEB-NEB-OPE,NER-NER-OPE,CPN-LAB-CPN-LAB-CPN-CPN-CPN-CPN-LAB-CPN-CPN-CPN-CPN-CPN-LAB-CPN-CPN-CPN-RAD-OPE,RAD-LAB-RAD-CAN-RAD-OPE-CAN-CAN-RAD-LAB-RAD-CAN-CAN-CAN-LAB-LAB-CAN-LAB-CAN-CAN-RAD-RAD-LAB-CAN-ADM-OPE-CAN-LAB-CAN-RAD-RAD-OPE-RAD-RAD-LAB-CAN-CAN-CAN-LAB-CAN-CAN-LAB-CAN-LAB-CAN-CAN-CAN-RAD-RAD-RAD-RAD-RAD-RAD-OPE-ENT-RAD-OPE,GNE-GNE-GNE-RAD-OPE,BST-BST-LAB-RAD-OPE,BST-BST-BST-BST-BST-OPB-RAD-OPE,NER-RAD-ISO-LAB-NER-NER-RAD-RAD-ISO-ISO-RAD-RAD-OPE,OPH-RAD-ADM-OPE-RAD-OPE-RAD-URL-OPE-URL-RAD-OPE-RAD-URL-LAB-ADM-OPE-RAD-URL-RAD-OPE,URL-URL-URL-URL-RAD-OPE,PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-ORP-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-RAD-ISO-ISO-PHY-ORP-DOL-PHY-OPE-PHY-PHY-PHY-PHY-OPE-PHY-PHY-PHY-PHY-PHY-OPE-PHY-PHY-PHY-PHY-OPE-ORP-OPE-OPE-ORP-CHR-OPE-ENT-ENT-ISO-ISO-RAD-OPE-MEI-LAB-OPE-MEI-ORP-PHY-OPE-MEI-PHY-PHY-PHY-PHY-CHR-MEI-RAD-PHY-ANE-MEI-PHY-ADM-OPE-RAD-RAD-OPE-CHR-OPE-DER-MEI-CHR-ORP-LAB-RAD-CHR-OPE-OPE,RAD-RAD-RAD-RAD-DOP-RAD-MEI-RHU-RAD-RAD-RHU-PNE-PNE-LAB-PNE-RAD-PNE-PNE-PNE-ISO-ISO-COR-COR-RAD-ISO-ISO-RAD-ART-ADM-RAD-RAD-PNE-OPE-RAD-NER-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-OPH-CAN-LAB-CAN-LAB-CAN-MEI-RAD-PNE-ART-PNE-LAB-RAD-CAN-LAB-CAN-LAB-CAN-LAB-CAN-MEI-LAB-CAN-LAB-CAN-RAD-RAD-ART-ART-RAD-LAB-LAB-CAN-LAB-MEI-LAB-RAD-ANE-ISO-ISO-RAD-OPE,RAD-RAD-RAD-ORL-LAB-ANE-ORL-ADM-OPE,PED-LAB-PED-ANE-OPE,CHR-LAB-RAD-RAD-ANE-CHR-ENT-OPE-OPE,RAD-RAD-RAD-RAD-RAD-ISO-ISO-RAD-RAD-RAD-RAD-RAD-OPE-RAD-RAD-ISO-RAD-ISO-STO-ENT-RAD-STO-RAD-ISO-RAD-RAD-OPE,PHY-PHY-ORP-PHY-PHY-PHY-PHY-PHY-OPE-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-ORP-OPE-PHY-RAD-RAD-PHY-PHY-ISO-RAD-ISO-ORP-ORP-OPE-ADM-OPE-OPE,RAD-LAB-CAN-CAN-RAD-RAD-OPE-ENT-RAD-CHR-CHR-LAB-OPE,RAD-OPH-OTB-OTB-OTB-OTB-ANE-OPE,LAB-RAD-CHR-ENT-ENT-MEI-LAB-MEI-MEI-MEI-CHR-RAD-LAB-ANE-OPE,NEB-RAD-RAD-CHR-RHU-CHR-CHR-LAB-ANE-OPE-CHR-CHB-CHB-CHB-CHB-RHU-CHR-RHU-LAB-ANE-OPE,COB-COR-COR-COR-COR-ISO-ISO-ISO-COR-RAD-PNE-PNE-PNE-RAD-RAD-COR-COR-ENT-ENT-COR-COR-OPE,MEI-NER-NER-PSI-PSI-LAB-RAD-PSI-NER-ART-LAB-NER-ART-PSI-PSI-ART-ART-ANE-LAB-OPE,RAD-GNE-GNE-GNE-GNE-ISO-ISO-RAD-COR-RAD-COR-CAN-CAN-RAD-LAB-CAN-DER-LAB-OPE,LAB-COR-COR-PNE-PNE-PNE-PNE-COR-PNE-URL-LAB-LAB-URL-URL-PNE-COR-COR-ISO-LAB-ISO-ISO-ORL-RAD-LAB-COR-ANE-ORL-OPE,RAD-OPH-PSB-COB-RAD-ORL-PSI-PSI-ORL-ORL-PNE-PNE-PNE-LAB-ANE-ORL-OPE,CHR-MEI-MEI-ENT-ENT-MEI-CHR-CHR-ENT-MEI-ENT-ENT-MEI-LAB-MEI-MEI-CHR-ANE-LAB-RAD-ADM-ANE-OPE-RAD,BST-BST-ANE-OPE,ENB-LAB-COR-ANE-OPE,STO-OPH-ANE-OPE,ENT-RAD-LAB-ANE-ENT-OPE-OPE,ORL-LAB-ANE-ORL-OPE,RAD-PED-PED-PED-OPE,URL-LAB-RAD-ANE-OPE-URL-URL-ORP-URL-OPE,ORP-NER-ORP-LAB-ANE-ADM-OPE,PED-LAB-RAD-RAD-PED-STO-STO-LAB-ANE-ADM-OPE,LAB-URL-COR-OPH-OPH-ANE-ADM-OPE,OPH-OPH-OPH-OPH-OPH-ORL-URL-LAB-ANE-ADM-OPE-URL-OPH-OPH-OPH-OPH-OPH-ANE-ADM-OPE,COR-RAD-RAD-ORP-LAB-URL-RAD-URL-COR-COR-URL-ENT-COR-URL-URL-URL-RAD-URL-ANE-ADM-OPE,LAB-COR-COR-COR-RAD-ART-ART-DOP-RAD-ART-PNE-PNE-PNE-LAB-RAD-COR-RAD-ALA-ANE-OPE,GNB-BCB-BST-BST-LAB-ANE-OPE,DOL-ISO-RAD-ISO-ISO-OPE-OPE-BCB-OPE-GNE-DOL-GNE-DYN-GNE-LAB-ANE-OPE,RAD-CHR-RAD-OPE-CHR-PNE-PRT-LAB-ANE-OPE,STO-STO-ENT-MEI-MEI-ENT-LAB-MEI-ANE-OPE,DER-LAB-OPH-LAB-PSI-STO-PRD-PRD-ORP-RAD-PRD-ORP-PRD-ORP-LAB-ORP-ANE-OPE,DEB-OLB-BCB-OLB-RAD-OTB-OLB-LAB-RAD-ANE-OPE,RAD-OTB-RAB-OTB-RAB-ARB-OTB-BCB-ARB-MEI-SNO-BCB-MEB-ARB-ARB-MEB-MEI-RAD-RAD-ARB-RAD-ISO-ISO-DOP-OPE-RAD-ART-ART-ADM-OPE-ARB-ARB-OPE,NER-CAN-CAN-LAB-CAN-OTB-LAB-CAN-DOL-NER-LAB-CAN-NER-LAB-CAN-LAB-CAN-OPE-OPE-CAN-LAB-CAN-LAB-CAN-LAB-CAN-OPE,ORP-RAD-RAD-ISO-ISO-ORP-ORP-CHR-GNE-OPE,OPH-ANE-ADM-ADM-OPE-OPH-OPH-LAB-COR-OPH-OPH-OPH-COR-LAB-URL-LAB-RAD-RAD-OPE-URL-URL-URL-NER-OPE,PED-PNE-PED-PNE-PED-ORL-LAB-ANE-ORL-OPE,ORL-RAD-PED-ANE-PED-OPE,OTB-ORP-PED-ORP-OTB-PED-LAB-ANE-RAD-OPE-RAD-OTB-RAD-OTB-DIB-OTB-RAB-OPE,STO-ORP-RAD-RAD-RAD-ORP-LAB-ANE-ADM-OPE,RAD-ORP-RAD-RHU-ISO-ISO-RHU-RAD-RHU-ORP-LAB-RAD-ANE-ADM-OPE,RAD-RAD-RAD-CHR-LAB-RAD-CHR-MEI-ANE-LAB-ADM-OPE,RAD-OPH-ORL-RAD-ORL-ORL-ORL-LAB-ANE-ORL-ADM-OPE,ORL-PED-PED-RAD-ORL-PED-LAB-PED-PED-PED-PED-PED-ORL-PED-LAB-ANE-ORL-PED-RAD-OPE-ADM-PED-PED-PED-ADM-OPE,LAB-URL-URL-URL-COR-LAB-RAD-ANE-OPE-URL-URL-URL-COR-LAB-URL-RAD-CHR-RAD-LAB-ANE-OPE,PED-LAB-ANE-ADM-OPE-ANE-OPE,STO-LAB-ORP-RAD-ANE-OPE,PRT-PRT-RAD-LAB-DIS-CHR-PRT-CHR-CHR-COR-CHR-LAB-COR-ANE-COR-OPE,RAD-URL-RAD-URL-RAD-ISO-COR-COR-RAD-COR-LAB-COR-COR-NER-LAB-COR-LAB-NER-COR-COR-COR-RAD-RAD-RAD-RAD-NER-COR-ART-COR-COR-RAD-RAD-RAD-OPE-COR-ADM-PNE-COR-COR-COR-OPE,CPN-LAB-CPN-CPN-LAB-OBS-CPN-LAB-CPN-OBS-CPN-LAB-OBS-CPN-CPN-LAB-LAB-CPN-RAD-CPN-LAB-CPN-CPN-OPE,CPN-LAB-CPN-CPN-OBS-CPN-CPN-LAB-OBS-CPN-LAB-CPN-OBS-CPN-CPN-LAB-CPN-LAB-OBS-CPN-OPE,GNE-CPN-LAB-OBS-CPN-LAB-CPN-LAB-OBS-CPN-LAB-CPN-LAB-OBS-CPN-OBS-CPN-CPN-CPN-LAB-OPE,ORL-RAD-OPE-RAD-DIS-DIS-DIS-DIS-ORP-DIS-ORP-RAD-ORL-DIS-RAD-ORP-ORP-PHY-PHY-PHY-PHY-PHY-RAD-ORP-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-RAD-ORP-PHY-RAD-ORP-LAB-ANE-ADM-OPE-OPE,STO-STO-URL-URL-STO-URL-LAB-DER-LAB-RAD-SNO-GNE-DER-DER-DER-GNE-GNE-RAD-ISO-ISO-RAD-OPE-OPE,OPH-OPH-ANE-OPE-OPH-OPE,RAD-RAD-STO-STO-CHR-LAB-ANE-RAD-OPE,LAB-CPN-LAB-CPN-OBS-CPN-LAB-CPN-LAB-RAD-OPE,PRD-RAD-STO-STO-STO-STO-STO-RAD-DOL-RAD-RAD-STO-DOP-RAD-MEI-RAD-ISO-COR-COR-LAB-ENT-ISO-ISO-RAD-MEI-ENT-RAD-ENT-ENT-ENT-ENT-LAB-RAD-OPE,MEI-LAB-CHR-URL-URL-OPE-OPE-DOL-URL-RAD-MEI-URL-URL-OPE-URL-CHR-LAB-URL-URL-OPE,ENT-LAB-ANE-ADM-ENT-ENT-RAD-ISO-ENT-ENT-RAD-RAD-LAB-MEI-ENT-ENT-ENT-LAB-RAD-ANE-OPE-RAD,OPH-OPH-COR-LAB-PNE-PNE-PNE-PNE-COR-COR-RAD-RAD-ORP-ORP-RAD-ENT-ENT-RAD-RAD-RAD-ENT-ENT-DOP-RAD-RAD-ISO-RAD-RAD-PNE-PNE-OPE,CHR-RAD-LAB-ANE-ADM-OPE,CHR-LAB-RAD-ANE-ADM-OPE,GNE-ART-DOP-RAD-ART-LAB-RAD-ANE-OPE,CHR-LAB-RAD-ANE-OPE,ART-DOP-LAB-RAD-ANE-OPE,ORP-ORP-LAB-RAD-ANE-OPE,URL-PRT-PRT-PRT-PRT-RAD-LAB-RAD-ANE-OPE,URL-URL-LAB-RAD-ANE-OPE,COR-COR-COR-COR-RAD-LAB-RAD-RAD-ANE-OPE,OPH-COB-ENT-RAD-RAD-RAD-ISO-ENT-RAD-PNE-RAD-RAD-RAD-RAD-RAD-OPE-ENT-OPE,OPH-OPH-OPH-STO-LAB-URL-LAB-RAD-ANE-LAB-OPE,GNE-RAD-RAD-OPE-CHR-CHR-GNE-RAD-RAD-RAD-RAD-RAD-OPE-OPE,BCB-ANE-OPE,CHR-OPE,CHR-OPE,CHR-CHR-CHR-OPE,RAD-CHR-OPE,GNB-OPE,RAD-RAD-NER-OPE-OPE,NER-OPE-OPE-OPE,ORP-OPE,RAD-RAD-ENT-RAD-RAD-ISO-ISO-RAD-RAD-OPE-OPE-ENT-RAD-OPE,RAB-RAB-PED-RAD-OPE,BST-BST-BST-BST-BST-BST-BST-BST-BST-RAD-ENT-ENT-RAD-RAD-OPE,RAD-ORP-RAD-RAD-OPE,COR-COR-RAB-RAB-RAB-BCB-RAD-OPE-RAD,RAD-ORL-OPH-OPH-CAN-ORP-RAB-RAB-LAB-ORP-CAN-ORP-RAB-RAB-RAB-RAD-GNE-ORP-RAD-LAB-RAD-RAD-ORP-ANE-CAN-OPE,RAD-ORP-RAB-ENT-ENT-COR-COR-ORP-ENT-LAB-RAD-CHR-RAD-RAD-RAD-ISO-ENT-ENT-CHR-RAD-LAB-ANE-OPE,ISO-CAN-ISO-LAB-RAD-GNE-CAN-LAB-CAN-CAN-RAD-RAD-RAD-ART-ARB-LAB-RAD-ANE-OPE,ISO-COR-COR-COR-ISO-ISO-ISO-NER-ENT-COR-COR-COR-ENT-RAD-ENT-LAB-RAD-ANE-OPE,COR-ISO-COR-ISO-ISO-COR-COR-RAD-ART-RAD-ISO-ISO-RAD-MEI-LAB-LAB-LAB-LAB-RAD-ANE-OPE,NER-COR-COR-COR-RAD-NER-NER-NER-RAD-COR-RAD-RAD-NER-ORP-LAB-RAD-ANE-OPE,ORL-CHR-LAB-RAD-ANE-STO-OPE-CHR-CHR-STO-RAD-RAD-RAD-RAD-RAD-RAD-RAD-LAB-CAN-LAB-OPE,ADM-OPH-ANE-ADM-ADM-OPE,RAD-ORL-LAB-ANE-OPE,ANE-PED-LAB-OPE,ISO-ISO-RAD-COR-ORP-LAB-RAD-OPE,PED-RAD-OPH-RAD-NER-RAD-RAD-OPE-RAD-ORP-RAD-ORP-ORP-RAD-RAD-ORP-OPE-ORP-DIS-RAD-ORP-RAD-OPE-RAD-RAD-ORP-ORP-RAD-ADM-OPE-DIS-ORP-RAD-OPE-ORP-LAB-ANE-OPE,OPH-GNE-CPN-LAB-CPN-LAB-OBS-CPN-LAB-CPN-LAB-OBS-CPN-LAB-CPN-LAB-CPN-DER-OBS-CPN-LAB-CPN-CPN-CPN-CPN-LAB-CPN-STO-CPN-OPE,CPN-LAB-OBS-CPN-LAB-CPN-LAB-OBS-CPN-LAB-CPN-LAB-CPN-CPN-LAB-OBS-CPN-CPN-LAB-CPN-CPN-LAB-CPN-RAD-RAD-RAD-RAD-LAB-CHR-CPN-ENT-LAB-ANE-RAD-RAD-RAD-RAD-LAB-OPE,ORP-PHY-PHY-PHY-PHY-PHY-ORP-PHY-PHY-PHY-PHY-ORP-RAD-ORP-ORP-GNE-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-LAB-MEI-OPH-RAD-GNE-LAB-LAB-RAD-ORP-ORP-ORP-OPH-LAB-RAD-ANE-OPH-OPE,DOL-ORP-RAD-OPE-ORP-ORP-ORP-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-DOL-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-ORP-PHY-PHY-PHY-PHY-OPE-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-PHY-RAD-ORP-RAD-MEI-ORP-RAD-ORP-MEI-OPE,RAD-RAD-RAD-RAD-RAD-OPE,ADM-COR-RAD-PNE-DOP-OPE,COR-RAD-DOP-RAD-PNE-OPE,RAD-RAD-RAD-ENT-RAD-RAD-OPE,LAB-RAD-RAD-RAD-OPE-RAD-RAD-OPE,RAD-RAD-RAD-RAD-COR-DOP-ISO-RAD-PNE-RAD-RAD-OPE,RAD-RAD-RAD-RAD-RAD-ISO-ISO-RAD-RAD-RAD-RAD-OPE,RAD-RAD-RAD-RAD-RAD-OPE,RAD-OPE-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-RAD-OPE";
var dataFormat = function(allData,src,uniq){
  var splitByArrayMark = allData.split(',');
  var result = [];
  for(var i = 0, len = splitByArrayMark.length; i < len; i++){
    if(uniq){
      result.push(outputIO(splitByArrayMark[i], uniq));
    }
    else{
      result.push(outputIO(splitByArrayMark[i]));
    }
  }
  fileOutput(result, src);
}

var outputIO = function(str, uniq){
  var strArray = str.split('-');
  var result= "";
  for(var j = 0, len = strArray.length; j < len;j++){
    if(j === 0){
      result += strArray[j] + "_O ";
    }
    else if(j === len-1){
      result += strArray[j] + "_I ";
    }
    else{
      result += strArray[j] + "_I ";
      result += strArray[j] + "_O ";
    }
  }
  if(uniq === 'clear'){
    result = clearRepeat(result)
  }
  return result;
}

var fileOutput = function(data, src){
  fs.writeFile(src,data,function(err){
        if(err) throw err;
  });
}

var clearRepeat = function(str){
  var originArr = str.split(" ");
  var resultArr = _.uniq(originArr);
  var result = "";
  for(var i = 0 , len = resultArr.length; i < len; i++){
    result += resultArr[i] + " ";
  }
  return result;
}
dataFormat(allData, './result.txt');
dataFormat(allData, './result-uniq.txt', 'clear');
