using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Oaktio.Model
{
    class TroubleTicket
    {
        public string description { get; set; } //
        public string severity { get; set; } //
        public string type { get; set; } //
        public string creationDate { get; set; } //
        public string targetResolutionDate { get; set; } //
        public string status { get; set; } //
        public List<RelatedParty> relatedParty { get; set; } //
        public List<RelatedObject> relatedObject { get; set; } //
        public List<Note> note { get; set; } //
    }
}
/*
 "description": "Some Description",
 
   "severity": "High",
   "type": "Bills, charges or payment",
   "creationDate": "2015-04-14T17:14:29UTC",
   "targetResolutionDate": "2015-04-14T17:14:29UTC",
   "status": "Submitted",
   "relatedParty": [
       {
           "id": "any party identifer",
           "href": "http//.../party/42",
           "role": "role"
       },
       {
           "id": "any party identifer",
           "href": "http//.../party/42",
           "role": "role"
       }
   ],
   "relatedObject": [
       {
           "involvement": "involvment",
           "reference": "referenceobject"
       },
       {
           "involvement": "involvment",
           "reference": "referenceobject"
       }
   ],
   "note": [
       {
           "date": "2015-04-14T17:14:29.855+0000",
           "author": "author",
           "text": "text"
       },
       {
           "date": "2015-04-14T17:14:29.855+0000",
           "author": "author",
           "text": "text"
       }
   ]
*/