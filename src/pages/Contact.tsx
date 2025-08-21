import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Clock, 
  Phone, 
  Mail, 
  Send,
  HeadphonesIcon,
  Star,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "在线客服",
      description: "7×24小时在线服务",
      action: "立即咨询",
      status: "在线",
      color: "success"
    },
    {
      icon: Mail,
      title: "邮箱支持",
      description: "support@recharge.com",
      action: "发送邮件",
      status: "24小时内回复",
      color: "info"
    },
    {
      icon: Phone,
      title: "电话客服",
      description: "400-888-0000",
      action: "拨打电话",
      status: "工作日 9:00-18:00",
      color: "warning"
    }
  ];

  const commonIssues = [
    {
      question: "支付后没有收到卡密",
      answer: "请检查邮箱垃圾邮件夹，或联系客服提供订单信息。"
    },
    {
      question: "卡密无法使用",
      answer: "请确认卡密输入正确，且在有效期内。如仍有问题请联系客服。"
    },
    {
      question: "如何申请退款",
      answer: "未使用的卡密可在7天内申请退款，请提供购买凭证。"
    },
    {
      question: "账户安全问题",
      answer: "请立即联系客服，我们会协助您处理账户安全相关问题。"
    }
  ];

  const serviceFeatures = [
    "专业客服团队",
    "多渠道支持",
    "快速响应",
    "问题跟踪",
    "满意度调查"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "提交成功",
      description: "我们已收到您的消息，将在24小时内回复。",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
          联系客服
        </h1>
        <p className="text-muted-foreground text-lg">
          遇到问题？我们的专业团队随时为您提供帮助
        </p>
      </div>

      {/* 联系方式 */}
      <section>
        <div className="grid md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <Card key={index} className="card-elevated hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  method.color === 'success' ? 'bg-success/10' : 
                  method.color === 'info' ? 'bg-info/10' : 'bg-warning/10'
                }`}>
                  <method.icon className={`w-8 h-8 ${
                    method.color === 'success' ? 'text-success' : 
                    method.color === 'info' ? 'text-info' : 'text-warning'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-muted-foreground mb-2">{method.description}</p>
                <Badge 
                  className={`mb-4 ${
                    method.color === 'success' ? 'bg-success/10 text-success' : 
                    method.color === 'info' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'
                  }`}
                >
                  {method.status}
                </Badge>
                <Button className="w-full btn-primary">
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 提交工单 */}
        <section>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-primary" />
                <span>提交工单</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="请输入您的姓名"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="请输入您的邮箱"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject">主题</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="请简要描述问题"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">详细描述</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="请详细描述您遇到的问题，包括具体的错误信息、操作步骤等"
                    rows={5}
                    required
                  />
                </div>

                <div className="p-3 bg-info/10 rounded-lg border border-info/20">
                  <p className="text-sm text-info">
                    💡 提示：提供详细信息有助于我们更快地解决您的问题
                  </p>
                </div>

                <Button type="submit" className="w-full btn-primary">
                  <Send className="w-4 h-4 mr-2" />
                  提交工单
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* 常见问题 */}
        <section>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HeadphonesIcon className="w-5 h-5 text-primary" />
                <span>常见问题</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {commonIssues.map((issue, index) => (
                <div key={index} className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <h4 className="font-medium mb-2">{issue.question}</h4>
                  <p className="text-sm text-muted-foreground">{issue.answer}</p>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                查看更多常见问题
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* 服务承诺 */}
      <section>
        <Card className="card-primary">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">我们的服务承诺</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {serviceFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 工作时间 */}
      <section>
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-8 text-center">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">在线客服</p>
                  <p className="text-sm text-muted-foreground">7×24小时</p>
                </div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">电话客服</p>
                  <p className="text-sm text-muted-foreground">工作日 9:00-18:00</p>
                </div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">邮件支持</p>
                  <p className="text-sm text-muted-foreground">24小时内回复</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}