select * from mblack.candidates where concat(desired_salary,  last_name,  
email,  linkedin_skill,  gender,  time_zone,  industry,  
job_title,  first_name ) like lower('%Mary%')

select * from jimsmith.car_owners
where concat(email, car_model, car_make, gender, last_name, first_name, car_year)
like lower('%Mary%')