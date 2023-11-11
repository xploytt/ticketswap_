from flask import Flask, jsonify, url_for, render_template, abort, request, redirect
from flask_login import current_user, login_user, LoginManager, UserMixin, logout_user
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField, FloatField, RadioField
from wtforms.validators import DataRequired, Email, URL
import uuid, json, random, csv, pandas, smtplib
from flask_mail import Mail, Message
from email.message import EmailMessage

app = Flask(__name__)
app.config['SECRET_KEY'] = 'any_Secret_Key'

app.config['MAIL_SERVER'] = ''
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = ''
app.config['MAIL_PASSWORD'] = ''
app.config['MAIL_USE_TLS'] = False
# app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

paypal_errors = ['There was a problem communicating with the paypal servers.Please try again or via other payment method',
                 'We weren\'t able to setup preapproved payment at this time. Try again or use other payment methods',
                 'We\'re having trouble completing your request right now. Please try again shortly or '
                 'use other payment methods']

cc_errors = ['Unfortunately, there was an error while processing your payment. Your credit card was not charged.',
             'Payment Verification failed. Please try again with valid credentials or contact your payment provider. You'
             'r credit card was not charged',
             ]

login_manager = LoginManager(app)

def generate_uid():
    result = uuid.uuid4()
    return result.hex[0:5]


class User(UserMixin):
    def __init__(self, name, id):
        self.name = name
        self.id = id

user = User('admin', 1)


@login_manager.user_loader
def load_user(user_id):
    return user

class LoginForm(FlaskForm):
    secret_key = StringField('Enter passcode', validators=[DataRequired()])
    submit = SubmitField('Log in')


class EvtDetailsForm(FlaskForm):
    buyer_mail = StringField("Buyer's Email", validators=[DataRequired(), Email()])
    evt_name = StringField('Event name', validators=[DataRequired()])
    evt_price = FloatField('Event Price', validators=[DataRequired()])
    evt_centre = StringField('Event Centre', validators=[DataRequired()])
    evt_city = StringField('Event City', validators=[DataRequired()])
    evt_dt = StringField('Event Datetime', validators=[DataRequired()])
    max_tix = IntegerField('Maximum Tickets', validators=[DataRequired()])
    img_url = StringField('Event image url', validators=[URL()])
    payment_type = RadioField("Payment Method", choices=["Paypal", "Zelle"], validators=[DataRequired()])
    currency_type = RadioField("Currency", choices=["$", "£"], validators=[DataRequired()])
    payment_mail = StringField("Payment Email", validators=[DataRequired(), Email()])
    submit = SubmitField('Process Listing')


def read_csv_file(uid):
    evt_df = pandas.read_csv('evt_details.csv', encoding='iso-8859-1')
    evt_details = evt_df[evt_df.uid == uid]
    return evt_details


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if request.method == 'POST':
        # manaully check if the password is grind 
        if form.secret_key.data == 'grind':
            login_user(user)
            return redirect(url_for('send_listing'))
    return render_template('login.html', form=form)



@app.route('/send-listing', methods=['GET', 'POST'])
def send_listing():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))

    form = EvtDetailsForm()
    if form.validate_on_submit():
        buyer_mail = form.buyer_mail.data
        evt_name = form.evt_name.data
        evt_price = form.evt_price.data
        evt_centre = form.evt_centre.data
        evt_city = form.evt_city.data
        evt_dt = form.evt_dt.data
        max_tix = form.max_tix.data
        img_url = form.img_url.data
        payment_type = form.payment_type.data
        payment_mail = form.payment_mail.data
        currency = form.currency_type.data
        uid = generate_uid()

        with open('evt_details.csv', 'a') as csv_file:
            details_list = [uid, evt_price, evt_centre, evt_city, evt_dt, max_tix, img_url, evt_name, payment_type,
                            payment_mail, currency]
            writer_obj = csv.writer(csv_file)
            writer_obj.writerow(details_list)
            csv_file.close()

        evt_details = {'name': evt_name,
                       'evt_price': evt_price,
                       'evt_centre': evt_centre,
                       'evt_city': evt_city,
                       'evt_dt': evt_dt,
                       'max_tix': max_tix,
                       'img_url': img_url,
                       'uid': uid
                       }

        # ---------------------------------------
        # send html mail
        # ---------------------------------------
        logout_user()
        with open('./mail.html', 'r') as mail_file:
            mail_markup = mail_file.read()
        checkout_url = f"localhost:5000/list/{evt_details['name']}?uid={evt_details['uid']}"
        png_path = 'localhost:5000/static/assets/ticketswap.png'
        mail_markup = mail_markup.replace('{{url}}', checkout_url)
        mail_markup = mail_markup.replace('{{png}}', png_path)
        msg = Message(subject='Private Listing', sender='localhost@ticketswap', recipients=[buyer_mail])
        msg.html = mail_markup
        mail.send(message=msg)

        return f'{mail_markup}'

    return render_template('private_listing.html', form=form)
    

@app.route('/cart', methods=['POST'])
def cart():
    num_of_tickets = request.form['num_of_tix']
    event_name = request.form['event_name']
    event_datetime = request.form['dt']
    price = request.form['price']
    uid = request.form['uid']

    return render_template('cart.html', num_of_tickets=num_of_tickets,
                           event_name=event_name,
                           event_datetime=event_datetime,
                           price=price, uid=uid)


@app.route('/list/<tix_name_type>')
def event(tix_name_type):
    partners = ['ab.png', 'cercle.png', 'defqon.png', 'dgtl.png', 'sziget.png', 'eventix.png']
    prefix_images = []
    for partner in partners:
        prefix_images.append(f'../static/assets/partners/{partner}')

    evt_name = ' '.join(tix_name_type.split('-')).title().replace('%20', ' ')

    current_uid = request.args['uid']

    evt_details = read_csv_file(uid=current_uid)

    if evt_details.empty:
        return redirect('localhost:5000/404')

    return render_template('event.html',
                           partners=reversed(prefix_images),
                           evt=evt_name.replace('%20', ' '),
                           evt_city=evt_details.city.values[0],
                           evt_price=evt_details.price.values[0],
                           evt_cen=evt_details.centre.values[0],
                           evt_dt=evt_details.datetime.values[0],
                           max_tix=evt_details.maxtix.values[0],
                           img_url=evt_details.img_url.values[0],
                           currency=evt_details.currency.values[0]
                           )
    


@app.route('/payment/method', methods=['GET', 'POST'])
def payment_method():
    if request.method == 'POST':
        data = json.dumps(request.get_json())

        # send data to database or to thirdparty services.. i won't be implementing that for security purpose
        # this is just a simulated web server for practice purpose
            # mysql.insert into db (destructure data columns)
            # values(data columns here)
            
            # or send the necessary details to third party services


        # if there's an error returned, below could be implemented
        if data['paymentMode'] == 'cc':
            err_list = cc_errors
        elif data['paymentMode'] == 'paypal':
            err_list = paypal_errors

        return jsonify(data={
            'msg': f"{random.choice(err_list)}"
        })

    uid = request.args.get('uid')
    evt_details = read_csv_file(uid)

    if evt_details.empty:
        return redirect('localhost:5000/404')

    payment_mail = evt_details.payment_mail.values[0]
    payment_type = evt_details.payment_type.values[0]

    if payment_type.title() == "Paypal":
        img_path = "assets/paypal.png"
    else:
        img_path = 'assets/zelle.png'

    avail_payment_method = [
        {
            'name': 'Select your payment method',
            'paymentType': 'no-payment',
        },
        {
            'name': 'PayPal',
            'image_path': 'assets/paypal.png',
            'paymentType': 'paypal',
        },
        {
            'name': 'Credit or debit Card',
            'image_path': 'assets/visa.jfif',
            'paymentType': 'cc',
        
        },
        # {
        #     'name': payment_type,
        #     'image_path': img_path,
        #     'paymentType': 'zelle' #this payment type is for the client side to use
        # }
    ]

    return render_template('method.html',
                           avail_methods=avail_payment_method,
                           payment_mail=payment_mail,
                           payment_type=payment_type.title(),
                           img_path=img_path
                           )


if __name__ == '__main__':
    app.run()
